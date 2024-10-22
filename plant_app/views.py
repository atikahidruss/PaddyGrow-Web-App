from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'plant_app/home.html')

def dashboard(request, plant_id):
    return render(request, 'plant_app/dashboard.html', {'plant_id': plant_id})
