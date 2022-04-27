from django.db import models
from django.contrib.auth import get_user_model

import uuid
# Create your models here.

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    wiki_title = models.CharField(max_length=255)
    target_lang = models.CharField(max_length=25)
    fk_user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


class Sentence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    original_sentence = models.TextField()
    translated_sentence = models.TextField(null=True)
    fk_project = models.ForeignKey(Project, on_delete=models.CASCADE)