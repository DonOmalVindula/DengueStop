import 'package:dengue_app/models/user.dart';
import 'package:dengue_app/networking/ApiProvider.dart';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:password_hash/password_hash.dart';


class UserService {
  final apiProvider = ApiProvider();
  final storage = FlutterSecureStorage();
  final generator = PBKDF2();
  User user = User();

  Future<bool> createUser(User user) async {
    var url = 'create_user';
    // generating a salt to hash the password using PBKDF2
    user.salt = Salt.generateAsBase64String(32);
    var hash = generator.generateBase64Key(user.password, user.salt, 1000, 32);
    // storing the hash instead of plain test of password
    user.password = hash;
    String jsonUser = jsonEncode(user.toJson());
    var response = await apiProvider.post(url, jsonUser);
    if(response['code'] == 200) {
      return true;
    } else {
      print(response);
      return false;
    }
  }

  Future<String> getUserSalt(String username) async {
    var usernameObj = {"username": username};
    var jsonUsername = jsonEncode(usernameObj);
    var url = 'get_user_salt';
    var response = await apiProvider.post(url, jsonUsername);
    if(response['code'] == 200 && response['data']['salt'] != '') {
      return response['data']['salt'];
    } else {
      return '';
    }
  }


  Future<bool> loginUser({String username, String password}) async {
    String userSalt = await getUserSalt(username);
    String hash;
    if(userSalt != '') {
      // generating the hash using the provided password
      hash = generator.generateBase64Key(password, userSalt, 1000, 32);
      // sending the username and provided password hash for
      var loginObj = {"username" : username, "password": hash};
      var jsonLogin = jsonEncode(loginObj);
      var url = 'login_user';
      var response = await apiProvider.post(url, jsonLogin);
      if(response['code'] == 200) {
        // we will receive the jwt in the response
        var jwt = response['data']['token'];
        // stores the jwt in flutter secure storage
        await storage.write(key: 'userToken', value: jwt);
        return true;
      }
    }
    return false;
  }
}