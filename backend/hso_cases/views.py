from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Case
from .serializers import CaseSerializer   


class HSOCaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all().order_by('-created_at')
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return cases created by the logged-in user
        return Case.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-district')
    def by_district(self, request):
        """
        Returns case counts by district for the logged-in user.
        """
        data = (
            self.get_queryset()
            .values('district')
            .annotate(count=Count('id'))
            .order_by('district')
        )
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='disease-distribution')
    def disease_distribution(self, request):
        """
        Returns case counts by disease for the logged-in user.
        """
        data = (
            self.get_queryset()
            .values('disease')
            .annotate(count=Count('id'))
            .order_by('disease')
        )
        return Response(list(data))
    
    
    @action(detail=False, methods=['get'], url_path='treatment-distribution')
    def treatment_distribution(self, request):
        """
        Returns case counts by treatment for the logged-in user.
        """
        data = (
            self.get_queryset()
            .values('treatment')
            .annotate(count=Count('id'))
            .order_by('treatment')
        )
        return Response(list(data))
    
    
    @action(detail=False, methods=['get'], url_path='symptom-distribution')
    def symptom_distribution(self, request):
        """
        Returns case counts by symptoms for the logged-in user.
        """
        data = (
            self.get_queryset()   
            .values('symptoms')  
            .annotate(count=Count('id'))
            .order_by('symptoms')
        )
        return Response(list(data))
    
    @action(detail=False, methods=['get'], url_path='vector-control-distribution')
    def vector_control_distribution(self, request):
        """
        Returns case counts by vector control measure for the logged-in user.
        """
        data = (
            self.get_queryset()   
            .values('Vector_control_measure')  
            .annotate(count=Count('id'))
            .order_by('Vector_control_measure')
        )
        return Response(list(data))
    
    @action(detail=False, methods=['get'], url_path='vector-control-distribution')
    def vector_control_distribution(self, request):
        """
        Returns case counts by vector control measure for the logged-in user.
        """
        data = (
            self.get_queryset()   
            .values('Vector_control_measure')  
            .annotate(count=Count('id'))
            .order_by('Vector_control_measure')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='diagnosis-distribution')
    def diagnosis_distribution(self, request):
        """
        Returns case counts by vector control measure for the logged-in user.
        """
        data = (
            self.get_queryset()   
            .values('diagnosis')  
            .annotate(count=Count('id'))
            .order_by('diagnosis')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        """
        Returns general statistics for the logged-in user.
        """
        total_cases = self.get_queryset().count()
        male_cases = self.get_queryset().filter(sex='Male').count()
        female_cases = self.get_queryset().filter(sex='Female').count()  
        vector_control_measure_fg = self.get_queryset(Vector_control_measure='Fogging').count()
        vector_control_measure_wd = self.get_queryset(Vector_control_measure='Proper Waste Disposal').count()
        vector_control_measure_dm = self.get_queryset(Vector_control_measure='Drainage Maintenance').count()
        vector_control_measure_rs = self.get_queryset(Vector_control_measure='Indoor Residual Spraying').count()
        diagnosis_ml = self.get_queryset(diagnosis='Malaria').count()
        diagnosis_pn = self.get_queryset(diagnosis='Pneumonia').count()
        diagnosis_tf = self.get_queryset(diagnosis='Typhoid Fever').count()
        diagnosis_hy = self.get_queryset(diagnosis='Hypertension').count()

        return Response({
            "total_cases": total_cases,
            "male_cases": male_cases,
            "female_cases": female_cases,
            "vector_control_measure_fg": vector_control_measure_fg,
            "vector_control_measure_wd": vector_control_measure_wd,
            "vector_control_measure_dm": vector_control_measure_dm,
            "vector_control_measure_rs": vector_control_measure_rs,
            "diagnosis_ml": diagnosis_ml,
            "diagnosis_pn": diagnosis_pn,
            "diagnosis_tf": diagnosis_tf,
            "diagnosis_hy": diagnosis_hy,  
        }) 
     