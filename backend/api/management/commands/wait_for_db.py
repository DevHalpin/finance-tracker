import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError

class Command(BaseCommand):
    help = "Wait for database to become available before continuing."

    def handle(self, *args, **options):
        self.stdout.write("Waiting for database...")
        db_conn = None
        max_retries = 10
        retry_count = 0
        delay = 3

        while not db_conn and retry_count < max_retries:
            try:
                db_conn = connections['default']
                db_conn.cursor()
            except OperationalError as e:
                retry_count += 1
                self.stdout.write(f"Database unavailable ({e}), retry {retry_count}/{max_retries}...")
                time.sleep(delay)

        if db_conn:
            self.stdout.write(self.style.SUCCESS("Database is ready!"))
        else:
            self.stderr.write(self.style.ERROR("Failed to connect to database after retries."))
            exit(1)
