from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)
    def to_internal_value(self, data):
        return ObjectId(data)

class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Team
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team', write_only=True, required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'team', 'team_id']

class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)
    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'type', 'duration', 'calories']

class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)
    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'user_id', 'score']

class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Workout
        fields = '__all__'
