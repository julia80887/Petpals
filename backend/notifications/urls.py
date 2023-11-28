from django.urls import path

from notifications.views import CreateNotificationsView, NotificationListView, NotificationRetrieveUpdateDestroyAPIView

app_name = 'notifications'

urlpatterns = [
    # path('new/', CreateNotificationsView.as_view(), name='create'),
    path('', NotificationListView.as_view(), name='list'),
    path('<int:pk>/',  NotificationRetrieveUpdateDestroyAPIView.as_view(), name='action'),
]