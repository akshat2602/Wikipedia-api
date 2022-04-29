from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from wikipediaapi import Wikipedia
import pysbd


from .models import Project, Sentence, Language
from .serializers import ProjectSerializer, SentenceSerializer, LanguageSerializer, ProjectCreateSerializer
# Create your views here.

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def create(self, request):
        serializer = ProjectCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            intro = Wikipedia().page(serializer.data['wiki_title']).summary
            seg = pysbd.Segmenter(language="en", clean=False)
            segmented_text = seg.segment(intro)
            project = Project.objects.get(id=serializer.data['id'])
            for text in segmented_text:
                Sentence.objects.create(fk_project=project, original_sentence=text)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SentenceListAPIView(APIView):
    serializer_class = SentenceSerializer
    
    def get(self, request, id):
        sentence = Sentence.objects.filter(fk_project=id)
        if sentence:
            serializer = SentenceSerializer(sentence, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class SentenceUpdateAPIView(APIView):
    serializer_class = SentenceSerializer
    
    def patch(self, request, id):
        sentence = Sentence.objects.get(id=id)
        serialized = SentenceSerializer(sentence, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class LanguageGetView(generics.ListAPIView):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()