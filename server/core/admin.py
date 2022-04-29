from django.contrib import admin

from .models import Project, Sentence, Language
# Register your models here.
admin.site.register(Language)
admin.site.register(Project)
admin.site.register(Sentence)