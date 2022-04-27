from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from wikipediaapi import Wikipedia
import pysbd


from .models import Project, Sentence
from .serializers import ProjectSerializer, SentenceSerializer
# Create your views here.

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(fk_user=self.request.user)

    def create(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(fk_user=self.request.user)
            print("HERE 1")
            intro = Wikipedia().page(serializer.data['wiki_title']).summary
            seg = pysbd.Segmenter(language="en", clean=False)
            segmented_text = seg.segment(intro)
            project = Project.objects.get(id=serializer.data['id'])
            for text in segmented_text:
                Sentence.objects.create(fk_project=project, original_sentence=text)

            print("HERE 2")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SentenceListAPIView(APIView):
    serializer_class = SentenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, id):
        sentence = Sentence.objects.filter(fk_project=id)
        if sentence:
            serializer = SentenceSerializer(sentence, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class SentenceUpdateAPIView(APIView):
    serializer_class = SentenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    
    def patch(self, request, pk):
        sentence = Sentence.objects.get(pk=pk)
        serialized = SentenceSerializer(sentence, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
