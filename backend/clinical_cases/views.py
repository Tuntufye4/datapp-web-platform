from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Case
from .serializers import CaseSerializer

class ClinicalCaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all().order_by('-created_at')
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-district')
    def by_district(self, request):
        """
        Returns the number of cases per district for the logged-in user.
        """
        data = (
            Case.objects
            .filter(created_by=request.user)
            .values('district')
            .annotate(count=Count('id'))
            .order_by('district')
        )
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='disease-distribution')
    def disease_distribution(self, request):
        """
        Returns the number of cases per disease for the logged-in user.
        """
        data = (
            Case.objects
            .filter(created_by=request.user)
            .values('disease')
            .annotate(count=Count('id'))
            .order_by('disease')
        )
        return Response(list(data))
    
    
    @action(detail=False, methods=['get'], url_path='vitalsigns-distribution')
    def vitalsigns_distribution(self, request):
        """
        Returns the number of cases per vital_sign for the logged-in user.
        """
        data = (
            Case.objects
            .filter(created_by=request.user)
            .values('vital_signs')
            .annotate(count=Count('id'))
            .order_by('vital_signs')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='treatment-distribution')
    def treatments(self, request):
        """
        Returns the number of cases per treatment for the logged-in user.
        """
        data = (
            Case.objects
            .filter(created_by=request.user)
            .values('treatment')
            .annotate(count=Count('id'))
            .order_by('treatment')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='diagnosis-distribution')
    def diagnosis(self, request):
        """
        Returns the number of cases per diagnosis for the logged-in user.
        """
        data = (
            Case.objects
            .filter(created_by=request.user)
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
        total_cases = Case.objects.filter(created_by=request.user).count()
        male_cases = Case.objects.filter(created_by=request.user, sex='Male').count()
        female_cases = Case.objects.filter(created_by=request.user, sex='Female').count()
        vital_signs_tp = Case.objects.filter(created_by=request.user, vital_signs='Temperature').count()
        vital_signs_bp = Case.objects.filter(created_by=request.user, vital_signs='Blood Pressure').count()
        vital_signs_bs = Case.objects.filter(created_by=request.user, vital_signs='Blood Sugar').count()
        vital_signs_os = Case.objects.filter(created_by=request.user, vital_signs='Oxygen Saturation').count()
        treatment_am = Case.objects.filter(created_by=request.user, treatment='Antimalarial').count()
        treatment_ab = Case.objects.filter(created_by=request.user, treatment='Antibiotic').count()
        treatment_ap = Case.objects.filter(created_by=request.user, treatment='Antipyretic').count()
        treatment_av = Case.objects.filter(created_by=request.user, treatment='Antiviral').count()
        diagnosis_ml = Case.objects.filter(created_by=request.user, treatment='Malaria').count()
        diagnosis_pn = Case.objects.filter(created_by=request.user, treatment='Pneumonia').count()
        diagnosis_tf = Case.objects.filter(created_by=request.user, treatment='Typhoid Fever').count()
        diagnosis_hy = Case.objects.filter(created_by=request.user, treatment='Hypertension').count()


        return Response({
            "total_cases": total_cases,
            "male_cases": male_cases,
            "female_cases": female_cases,
            "vital_signs_tp": vital_signs_tp,
            "vital_signs_bp": vital_signs_bp, 
            "vital_signs_bs": vital_signs_bs,
            "vital_signs_os": vital_signs_os,
            "treatment_am": treatment_am,
            "treatment_ab": treatment_ab,
            "treatment_ap": treatment_ap,
            "treatement_av": treatment_av,
            "diagnosis_ml": diagnosis_ml,
            "diagnosis_pn": diagnosis_pn,
            "diagnosis_tf": diagnosis_tf,
            "diagnosis_hy": diagnosis_hy,  

        })
