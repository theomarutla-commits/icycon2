from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for user registration/signup."""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'token']

    def validate(self, data):
        """Validate that passwords match."""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        """Create a new user with the given credentials."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        return user

    def get_token(self, obj):
        """Return or create a token for the user."""
        token, _ = Token.objects.get_or_create(user=obj)
        return token.key


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    def validate(self, data):
        """Authenticate the user."""
        email = data.get('email')
        password = data.get('password')

        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'Invalid email or password.'})

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Invalid email or password.'})

        data['user'] = user
        return data

    def get_token(self, obj):
        """Return or create a token for the user."""
        user = obj.get('user')
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return token.key
        return None

    def get_user(self, obj):
        """Return user info."""
        user = obj.get('user')
        if user:
            return {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        return None
