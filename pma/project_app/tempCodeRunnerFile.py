import requests

from django.shortcuts import render
from credentials import CLIENT_ID,CLIENT_SECRET,REDIRECT_URI
from rest_framework.views import APIView



class AuthURL(APIView):
   def Auth_User(self,request):
     authorization_url = "https://channeli.in/oauth/authorise/"
     client_id = CLIENT_ID
     redirect_uri = REDIRECT_URI
     state = "RANDOM_STATE_STRING"

     params = {
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "state": state,
              }

# Send the GET request
     response = requests.get(authorization_url, params=params)

# Check the response status code
     if response.status_code == 200:
      print("Authorization request successful")
      print("Response content:")
      print(response.text)
     else:
      print(f"Authorization request failed with status code {response.status_code}")
      print("Response content:")
      print(response.text)

    
   def oauth_callback(request,format=None):
     token_url = "https://channeli.in/open_auth/token/"
     client_id = CLIENT_ID
     client_secret = CLIENT_SECRET
     redirect_uri = "REDIRECT_URI"
     authorization_code = "AUTHORIZATION_CODE" 


     data = {
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "authorization_code",
      "redirect_uri": redirect_uri,
      "code": authorization_code,
            }

     response = requests.post(token_url, data=data)

     if response.status_code == 200:
    
      token_data = response.json()
      access_token = token_data["access_token"]
      refresh_token = token_data["refresh_token"]
      expires_in = token_data["expires_in"]
      token_type = token_data["token_type"]
      scope = token_data["scope"]

   
     else:
       error_data = response.json()
       error_message = error_data.get("error_description", "Unknown error")

     print("Error Message:", error_message)

   def logout(request):
     revoke_token_url="https://channeli.in/open_auth/revoke_token/"
     client_id = CLIENT_ID
     client_secret = CLIENT_SECRET
     token_to_revoke = "TOKEN_TO_REVOKE" 
     token_type_hint = "refresh_token"  

     data = {
       "client_id": client_id,
       "client_secret": client_secret,
       "token": token_to_revoke,
       "token_type_hint": token_type_hint,
       }

     response = requests.post(revoke_token_url, data=data)

     if response.status_code == 200:
      print("Token revocation successful")
     else:
      print(f"Token revocation failed with status code {response.status_code}")
      print("Response content:")
      print(response.text)
