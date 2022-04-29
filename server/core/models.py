from django.db import models

import uuid
# Create your models here.

class Language(models.Model):
    language_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    def __str__(self):
        return self.name

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    wiki_title = models.CharField(max_length=255)
    fk_target_lang = models.ForeignKey(to=Language, on_delete=models.CASCADE, related_name='target_lang')


class Sentence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    original_sentence = models.TextField()
    translated_sentence = models.TextField(null=True)
    fk_project = models.ForeignKey(Project, on_delete=models.CASCADE)