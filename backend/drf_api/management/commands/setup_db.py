from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Set up the database for production deployment'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up database...'))
        
        # Run migrations
        self.stdout.write('Running migrations...')
        call_command('migrate', verbosity=1, interactive=False)
        
        # Collect static files
        self.stdout.write('Collecting static files...')
        call_command('collectstatic', verbosity=1, interactive=False)
        
        self.stdout.write(self.style.SUCCESS('Database setup completed successfully!')) 