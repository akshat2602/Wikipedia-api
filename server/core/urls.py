from django.urls import path
# from django.conf.urls import url
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='projects')
# router.register(r'sentence', views.SentenceViewSet, basename='sentence')
urlpatterns = router.urls

urlpatterns += [
    path('sentence/list/<uuid:id>', views.SentenceListAPIView.as_view()),
    path('sentence/update/<uuid:id>', views.SentenceUpdateAPIView.as_view()),
]