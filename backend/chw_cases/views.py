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
    
    
    @action(detail=False, methods=['get'], url_path='diagnosis-distribution')
    def diagnosis_distribution(self, request):
        """
        Returns the number of cases per disease filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        data = (
            qs.values('diagnosis')
            .annotate(count=Count('id'))
            .order_by('diagnosis')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='symptoms-distribution')
    def symptoms_distribution(self, request):
        """
        Returns the number of cases per disease filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        data = (
            qs.values('symptoms')
            .annotate(count=Count('id'))
            .order_by('symptoms')
        )
        return Response(list(data))
    

    @action(detail=False, methods=['get'], url_path='classification-distribution')
    def classification_distribution(self, request):
        """
        Returns the number of cases per disease filtered by patient_name if provided.
        """
        qs = Case.objects.all()
        patient_name = request.query_params.get("patient_name")
        if patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        data = (
            qs.values('classification')
            .annotate(count=Count('id'))
            .order_by('classification')
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
        confirmed_cases = qs.filter(classification='Confirmed').count()
        probable_cases = qs.filter(classification='Probable').count()   
        diagnosis_ml = qs.filter(diagnosis='Malaria').count() 
        diagnosis_pn = qs.filter(diagnosis='Pneumonia').count() 
        diagnosis_tf = qs.filter(diagnosis='Typhoid Fever').count() 
        diagnosis_hy = qs.filter(diagnosis='Hypertension').count() 
        visittype_iv = qs.filter(visit_type='Initial Visit').count() 
        visittype_fv = qs.filter(visit_type='Follow-up Visit').count() 
        housingtype_fv = qs.filter(housing_type='Permanent').count()
        housingtype_sp = qs.filter(housing_type='Semi-permanent').count()
        housingtype_td = qs.filter(housing_type='Traditional').count()

        # Calculate average cases per patient (using distinct patient_name)
        distinct_patients = qs.values("patient_name").distinct().count()
        avg_total_cases = total_cases / distinct_patients if distinct_patients > 0 else 0

        # Distinct male/female patients
        distinct_male_patients = qs.filter(sex="Male").values("patient_name").distinct().count()
        avg_male_cases = male_cases / distinct_male_patients if distinct_male_patients > 0 else 0

        distinct_female_patients = qs.filter(sex="Female").values("patient_name").distinct().count()
        avg_female_cases = female_cases / distinct_female_patients if distinct_female_patients > 0 else 0
        
      

        return Response({
            "total_cases": total_cases,
            "male_cases": male_cases,
            "female_cases": female_cases, 
            "confirmed_cases": confirmed_cases, 
            "probale_cases": probable_cases,     
            "avg_total_cases": round(avg_total_cases, 2),   
            "avg_male_cases": round(avg_male_cases, 2),
            "avg_female_cases": round(avg_female_cases, 2),
            "diagnosis_ml": diagnosis_ml,
            "diagnosis_pn": diagnosis_pn,
            "diagnosis_tf": diagnosis_tf,
            "diagnosis_hy": diagnosis_hy,
            "visittype_iv": visittype_iv,
            "visittype_fv": visittype_fv,
            "housingtype_fv": housingtype_fv,
            "housingtype_sd": housingtype_sp,
            "housingtype_sp": housingtype_td,
        })   
