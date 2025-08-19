from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Case
from .serializers import CaseSerializer


class CHWCaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all().order_by('-created_at')
    serializer_class = CaseSerializer   
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-district')
    def by_district(self, request):
        """
        Returns the number of cases per district filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        data = (
            qs.values('district')
            .annotate(count=Count('id'))
            .order_by('district')
        )
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='disease-distribution')
    def disease_distribution(self, request):
        """
        Returns the number of cases per disease filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        data = (
            qs.values('disease')
            .annotate(count=Count('id'))
            .order_by('disease')
        )
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        """
        Returns general statistics filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        total_cases = qs.count()
        male_cases = qs.filter(sex='Male').count()
        female_cases = qs.filter(sex='Female').count()

        return Response({
            "total_cases": total_cases,
            "male_cases": male_cases,
            "female_cases": female_cases   
        })
  