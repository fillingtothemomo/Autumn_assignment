from rest_framework import permissions

from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user and request.user.is_admin:
            return True
        

        return False
