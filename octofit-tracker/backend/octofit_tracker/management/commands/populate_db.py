from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import models as app_models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Borrar datos existentes
        User.objects.all().delete()
        app_models.Team.objects.all().delete()
        app_models.Activity.objects.all().delete()
        app_models.Leaderboard.objects.all().delete()
        app_models.Workout.objects.all().delete()

        # Crear equipos
        marvel = app_models.Team.objects.create(name='Marvel')
        dc = app_models.Team.objects.create(name='DC')

        # Crear usuarios (superhéroes)
        ironman = User.objects.create_user(username='ironman', email='ironman@marvel.com', password='password', team=marvel)
        spiderman = User.objects.create_user(username='spiderman', email='spiderman@marvel.com', password='password', team=marvel)
        batman = User.objects.create_user(username='batman', email='batman@dc.com', password='password', team=dc)
        superman = User.objects.create_user(username='superman', email='superman@dc.com', password='password', team=dc)

        # Crear actividades
        app_models.Activity.objects.create(user=ironman, type='Running', duration=30, calories=300)
        app_models.Activity.objects.create(user=spiderman, type='Cycling', duration=45, calories=400)
        app_models.Activity.objects.create(user=batman, type='Swimming', duration=60, calories=500)
        app_models.Activity.objects.create(user=superman, type='Yoga', duration=40, calories=200)

        # Crear leaderboard
        app_models.Leaderboard.objects.create(user=ironman, score=1000)
        app_models.Leaderboard.objects.create(user=spiderman, score=900)
        app_models.Leaderboard.objects.create(user=batman, score=950)
        app_models.Leaderboard.objects.create(user=superman, score=1100)

        # Crear workouts
        app_models.Workout.objects.create(name='Full Body', description='Entrenamiento completo', duration=60)
        app_models.Workout.objects.create(name='Cardio Blast', description='Entrenamiento de cardio', duration=45)

        self.stdout.write(self.style.SUCCESS('Base de datos poblada con datos de prueba.'))
