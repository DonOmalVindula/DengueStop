import 'package:dengue_app/models/province.dart';
import 'package:dengue_app/models/district.dart';
import 'package:dengue_app/networking/ApiProvider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DataService {
  final apiProvider = ApiProvider();

  Future<List<Province>> getProvinces() async {
    var url = 'get_provinces';
    List<Province> provinceList = List<Province>();
    List<dynamic> responseData = new List<dynamic>();
    var responseJson = await apiProvider.get(url);
    if (responseJson['code'] == 200) {
      responseData = responseJson['data'];
      if (responseData.length > 0) {
        for (int i = 0; i < responseData.length; i++) {
          Map<String, dynamic> map = responseData[i];
          provinceList.add(Province.fromJson(map));
        }
      }
    }
    return provinceList;
  }

  Future<List<District>> getDistricts() async {
    var url = 'get_districts';
    List<District> districtList = List<District>();
    List<dynamic> responseData = new List<dynamic>();
    var responseJson = await apiProvider.get(url);
    if (responseJson['code'] == 200) {
      responseData = responseJson['data'];
      if (responseData.length > 0) {
        for (int i = 0; i < responseData.length; i++) {
          Map<String, dynamic> map = responseData[i];
          districtList.add(District.fromJson(map));
        }
      }
    }
    return districtList;
  }

}