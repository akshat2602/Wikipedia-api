from rest_framework import serializers

from .models import Project, Sentence

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["id"]


class SentenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sentence
        fields = "__all__"
        read_only_fields = ["id"]