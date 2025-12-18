from django.core.management.base import BaseCommand
from jobs.scraper import run_all_scrapers, RemoteOKScraper, IndeedScraper

class Command(BaseCommand):
    help = 'Scrape jobs from various sources'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            help='Specific source to scrape (remoteok, indeed, or all)',
            default='all'
        )
        parser.add_argument(
            '--query',
            type=str,
            help='Search query for Indeed',
            default='software developer'
        )
    
    def handle(self, *args, **options):
        source = options['source'].lower()
        query = options['query']
        
        self.stdout.write(self.style.SUCCESS('Starting job scraping...'))
        
        if source == 'all':
            total_jobs = run_all_scrapers()
        elif source == 'remoteok':
            scraper = RemoteOKScraper()
            total_jobs = scraper.scrape()
        elif source == 'indeed':
            scraper = IndeedScraper()
            total_jobs = scraper.scrape(search_query=query)
        else:
            self.stdout.write(self.style.ERROR(f'Unknown source: {source}'))
            return
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully scraped {total_jobs} jobs!')
        )