"""
Fixed: Skips jobs when external_url is missing
Also supports alternative link selectors
"""

from django.core.management.base import BaseCommand
from jobs.models import Job, Company, Location, Skill, JobSource
from django.utils import timezone
import requests
from bs4 import BeautifulSoup
import time
import re

class Command(BaseCommand):
    help = 'Scrape jobs from WeWorkRemotely.com'

    BASE_URL = "https://weworkremotely.com"

    # All category pages we scrape
    CATEGORY_URLS = [
        "https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings",
        "https://weworkremotely.com/categories/remote-back-end-programming-jobs#job-listings",
        "https://weworkremotely.com/categories/remote-front-end-programming-jobs#job-listings",
    ]

    def handle(self, *args, **options):

        # Print starting info
        self.stdout.write('\n' + '='*60)
        self.stdout.write('Starting WeWorkRemotely Scraper')
        self.stdout.write('='*60 + '\n')

        headers = { 'User-Agent': 'Mozilla/5.0' }

        # Create or get the job source record in DB
        source, _ = JobSource.objects.get_or_create(
            name="WeWorkRemotely",
            defaults={'base_url': "https://weworkremotely.com"}
        )

        jobs_created = 0
        jobs_skipped = 0

        # Loop through all category URLs
        for category_url in self.CATEGORY_URLS:

            self.stdout.write(f"Fetching: {category_url}")
            response = requests.get(category_url, headers=headers, timeout=20)

            if response.status_code != 200:
                self.stdout.write(f"Failed: {response.status_code}")
                continue

            # Parse the HTML
            soup = BeautifulSoup(response.text, "html.parser")

            # Select all job listing elements
            job_listings = soup.select("li.new-listing-container")

            self.stdout.write(f"Found {len(job_listings)} jobs in category.\n")

            for job_elem in job_listings:
                try:
                    # Extract job title
                    title_elem = job_elem.select_one("h3.new-listing__header__title")
                    if not title_elem:
                        continue
                    title = title_elem.text.strip()

                    # Extract company name
                    company_elem = job_elem.select_one("p.new-listing__company-name")
                    company_name = (
                        company_elem.contents[0].strip()
                        if company_elem else "Unknown Company"
                    )

                    # Extract location
                    loc_elem = job_elem.select_one("p.new-listing__company-headquarters")
                    location_text = loc_elem.text.strip() if loc_elem else "Remote"

                    # Extract job URL (important)
                    link_elem = job_elem.select_one("a.listing-link--unlocked")
                    if not link_elem:
                        link_elem = job_elem.select_one("a.view-job")

                    # Skip job if URL not found
                    if not link_elem or not link_elem.get("href"):
                        self.stdout.write("Skipped job: No external URL\n")
                        jobs_skipped += 1
                        continue

                    job_url = self.BASE_URL + link_elem["href"]

                    # Extract categories/tags
                    cat_elems = job_elem.select("p.new-listing__categories__category")
                    categories = [
                        c.text.strip() for c in cat_elems if c.text.strip() != "Featured"
                    ]

                    # Determine job type
                    job_type = "full_time"
                    if any("contract" in c.lower() for c in categories):
                        job_type = "contract"
                    elif any("part" in c.lower() for c in categories):
                        job_type = "part_time"

                    # Salary extraction (if mentioned)
                    salary_min, salary_max = None, None
                    for c in categories:
                        if '$' in c:
                            nums = re.findall(r'\d+,?\d*', c)
                            if len(nums) >= 2:
                                salary_min = float(nums[0].replace(",", ""))
                                salary_max = float(nums[1].replace(",", ""))
                            elif len(nums) == 1:
                                salary_min = float(nums[0].replace(",", ""))

                    # Create/get related DB objects
                    company, _ = Company.objects.get_or_create(name=company_name)
                    location, _ = Location.objects.get_or_create(
                        city="Remote" if "remote" in location_text.lower() else location_text,
                        country="Worldwide",
                        is_remote=True
                    )

                    # Avoid duplicates
                    if Job.objects.filter(title=title, company=company).exists():
                        jobs_skipped += 1
                        continue

                    # Simple description text
                    description = (
                        f"{title} at {company_name}\n"
                        f"Location: {location_text}\n"
                        f"Type: {job_type}"
                    )

                    # Create Job object
                    job = Job.objects.create(
                        title=title,
                        company=company,
                        location=location,
                        description=description,
                        job_type=job_type,
                        experience_level="mid",
                        salary_min=salary_min,
                        salary_max=salary_max,
                        salary_currency="USD" if salary_min else None,
                        source=source,
                        external_url=job_url,
                        status="pending",
                        posted_date=timezone.now().date(),
                        tags=", ".join(categories)
                    )

                    # Skill detection logic
                    skill_keywords = [
                        "Python", "JavaScript", "React", "Node", "Django", "C#",
                        "Java", "PHP", "Go", "Rust", "Vue", "AWS", "Docker",
                        "Kubernetes", "Full Stack", "Frontend", "Backend"
                    ]

                    text = (title + " " + " ".join(categories)).lower()
                    for sk in skill_keywords:
                        if sk.lower() in text:
                            skill, _ = Skill.objects.get_or_create(name=sk)
                            job.skills.add(skill)

                    jobs_created += 1

                except Exception as e:
                    self.stdout.write(f"Error: {e}")
                    continue

                time.sleep(0.2)

        # Update last scraped timestamp
        source.last_scraped = timezone.now()
        source.save()

        # Print final output
        self.stdout.write('\nScraping Complete!')
        self.stdout.write(f'Jobs Created: {jobs_created}')
        self.stdout.write(f'Jobs Skipped: {jobs_skipped}')
        self.stdout.write('='*60 + '\n')
