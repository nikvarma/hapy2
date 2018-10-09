import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  IonicPage,
  NavController,
  Slides,
  ToastController,
  ActionSheetController,
  Events,
  ToastOptions
} from "ionic-angular";
import { MainPage } from "..";
import { Api, CallProvider, ConnectionStatus } from "../../providers";
import { Endpoints } from "../../config/Endpoints";
import { RequestOptions, Headers } from "@angular/http";
import { Logging } from "../../models/logging";
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker";
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html",
  providers: [ImagePicker]
})
export class WelcomePage implements OnInit, AfterViewInit {
  userDataForm: FormGroup;
  countryList: any;
  txtmobilenumber_sec: any;
  errorprint: any;
  logging: Logging;
  loadingspinner: boolean = false;
  isBtnClicked: boolean = false;
  netConnection: ConnectionStatus;
  otpData = { code: "", id: "" };
  userDetails = {
    name: "",
    fname: "",
    lname: "",
    dob: "",
    primarynumber: "",
    primarynumbercode: "",
    wallimage: "",
    profileimage: ""
  };
  userProfileImage: string = "assets/img/avatar-profile-picture-default-i.jpg";
  profiledefaultimage: boolean = false;
  @ViewChild(Slides)
  slides: Slides;
  constructor(
    public navCtrl: NavController,
    private api: Api,
    private call: CallProvider,
    private camera: Camera,
    private toast: ToastController,
    private imagePicker: ImagePicker,
    private events: Events,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.logging = new Logging();
    this.logging.className = "Welcome";
  }

  doSendOTP(event: Event): void {
    let countryCode = this.userDataForm.get("ddlcountry").value;
    let mobilenumber = this.userDataForm.get("txtmobilenumber").value;

    if (typeof countryCode == "object") {
      this.showToast({
        message: "Please select your country.",
        position: "bottom",
        duration: 2000
      });
    } else if (typeof mobilenumber == "object") {
      this.showToast({
        message: "Please enter your mobile number.",
        position: "bottom",
        duration: 2000
      });
    } else {
      this.loadingspinner = true;
      this.isBtnClicked = true;
      let countrycode = this.userDataForm.get("ddlcountry").value;
      let mobilenumber = this.userDataForm.get("txtmobilenumber").value;
      this.txtmobilenumber_sec = "(+" + countrycode + ") " + mobilenumber;

      (this.userDetails.primarynumber = mobilenumber),
        (this.userDetails.primarynumbercode = countrycode);

      let httpParams = {
        mobilenumber: mobilenumber,
        countrycode: countrycode
      };

      let option = new RequestOptions();
      option.headers = new Headers();
      option.headers.append("content-type", "application/json");
      this.api
        .get(Endpoints.api.auth + "v1/otp/sendonmobile", httpParams, option)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              this.otpData.code = res["responseObject"].code;
              this.otpData.id = res["responseObject"].id;
              this.slideLockUnlock(1);

              this.userDataForm.patchValue({
                txtverifyotp: this.otpData.code
              });
              this.call.setValueKey("otp", res["responseObject"]);
              setTimeout(() => {
                this.showToast({
                  message: "OTP sent successfully.",
                  duration: 2000
                });
              }, 1000);
              this.loadingspinner = false;
              this.isBtnClicked = false;
            } else {
              this.showToast({
                message: "Please try again after sometime.",
                duration: 2000
              });
              this.loadingspinner = false;
              this.isBtnClicked = false;
            }
          },
          err => {
            this.showToast({
              message: "Something went wrong, please try again after sometime.",
              duration: 2000
            });
            this.logging.message = err;
            this.loadingspinner = false;
            this.isBtnClicked = false;
            this.logging.methodeName = "doSendOTP";
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  openBox(): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image",
      cssClass: "image-select-actionsheet",
      buttons: [
        {
          icon: "images",
          text: "Gallary",
          handler: () => {
            this.imagePicker.hasReadPermission().then(res => {
              if (res) {
                this.pickImage();
              } else {
                this.imagePicker.requestReadPermission().then(res => {
                  this.imagePicker.hasReadPermission().then(res => {
                    if (res) {
                      this.pickImage();
                    } else {
                      actionSheet.dismiss();
                    }
                  });
                });
              }
            });
          }
        },
        {
          icon: "camera",
          text: "Camera",
          handler: () => {
            const cameraOption: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            };
            this.camera.getPicture(cameraOption).then(res => {
              this.userProfileImage = res;
            });
          }
        },
        {
          icon: "close",
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  pickImage(): void {
    let pickerOption: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 0,
      quality: 100,
      height: 450,
      width: 450
    };
    this.imagePicker.getPictures(pickerOption).then(res => {
      for (let i = 0; i < res.length; i++) {
        this.userProfileImage = res[i];
      }
    });
  }

  editMobileNumber(): void {
    this.slideLockUnlock(0);
  }

  doVerify(): void {
    let otp = this.userDataForm.get("txtverifyotp").value;

    if (typeof otp == "object") {
      this.showToast({
        message: "Please enter 6 digit OTP number.",
        position: "bottom",
        duration: 2000
      });
    } else if (typeof otp == "string" && otp.length != 6) {
      this.showToast({
        message: "OTP should be 6 digit number.",
        position: "bottom",
        duration: 2000
      });
    } else {
      this.loadingspinner = true;
      this.isBtnClicked = true;

      this.api
        .post(Endpoints.api.auth + "v1/otp/verify", {
          id: this.otpData.id,
          code: this.otpData.code
        })
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              if (res["responseObject"].status === true) {
                this.call.removeKey("otp");
                this.profiledefaultimage = true;
                this.slideLockUnlock(2);
                this.loadingspinner = false;
                this.isBtnClicked = false;
              } else {
                this.showToast({
                  message: "Invalid OTP, please enter valid OTP.",
                  duration: 2000
                });
                this.loadingspinner = false;
                this.isBtnClicked = false;
              }
            }
          },
          err => {
            this.loadingspinner = false;
            this.isBtnClicked = false;
            this.logging.methodeName = "doVerify";
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  goToHome(): void {
    let username = this.userDataForm.get("txtusername").value;
    let dob = this.userDataForm.get("txtdob").value;
    if (typeof username == "object") {
      this.showToast({
        message: "Please enter you name.",
        position: "bottom",
        duration: 2000
      });
    } else if (username.length <= 3 || username.split(" ")[1] == null) {
      this.showToast({
        message:
          "Name should be your full name, first and last name with space.",
        position: "bottom",
        duration: 2000
      });
    } else if (typeof dob == "object") {
      this.showToast({
        message: "Please select you Date of Birth.",
        position: "bottom",
        duration: 2000
      });
    } else {
      let userName = this.userDataForm.get("txtusername").value;
      let dob = this.userDataForm.get("txtdob").value;
      let fname = "";
      let lname = "";
      if (userName.split(" ").length > 0) {
        fname = userName.split(" ")[0];
        lname = userName.split(" ")[1];
      }
      this.loadingspinner = true;
      this.isBtnClicked = true;
      let headers = new Headers();

      this.api
        .post(
          Endpoints.api.user + "v1/users/save",
          {
            name: userName,
            fname: fname,
            lname: lname,
            dob: dob,
            about: "I am Online",
            Primarynumber: this.userDetails.primarynumber,
            primarynumbercode: this.userDetails.primarynumbercode,
            wallimage: this.userDetails.wallimage,
            profileimage: this.userDetails.profileimage,
            isactive: true,
            status: true
          },
          headers
        )
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              
              if (res["responseObject"].status == true) {
                this.call.setValueKey("userinfo", {
                  userId: res["responseObject"].id
                });
                //Add Google FB Token Call and Peer Token Call
                this.navCtrl.setRoot(MainPage);
              } else {
                this.logging.methodeName = "goToHome";
                this.call.setLoggin(this.logging);
                this.showToast({
                  message:
                    "Something went wrong, please try again after sometime.",
                  duration: 2000,
                  position: "bottom"
                });
              }
              this.loadingspinner = false;
              this.isBtnClicked = false;
            }
          },
          err => {
            this.loadingspinner = false;
            this.isBtnClicked = false;
            this.logging.methodeName = "goToHome";
            this.logging.message = err;
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  enterClick(event: Event): boolean {
    event.stopPropagation();
    return false;
  }

  slideLockUnlock(index: number): void {
    this.slides.lockSwipes(false);
    this.slides.slideTo(index);
    setTimeout(() => {
      this.slides.lockSwipes(true);
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.slides.lockSwipes(true);
  }

  ngOnInit(): void {
    this.userDataForm = new FormGroup({
      ddlcountry: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      txtmobilenumber: new FormControl(),
      txtusername: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
        ])
      ),
      txtverifyotp: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ])
      ),
      txtdob: new FormControl(null, Validators.required)
    });
    this.loadContry();
  }

  loadContry(): void {
    // this.events.subscribe("network:status", status => {
    //   this.netConnection = status;
    //   if (status == ConnectionStatus.Online) {
    this.api
      .get(Endpoints.vendor.restcountriesapi + "name;callingCodes")
      .subscribe(
        res => {
          this.countryList = res;
        },
        err => {
          this.toast
            .create({
              message: err,
              duration: 2000,
              position: "bottom"
            })
            .present();
        }
      );
    // } else {
    //   this.networkCall();
    // }
    //});
  }

  networkCall(): void {
    this.showToast({
      message: "No internet connection is available. App offline mode active.",
      duration: 2000
    });
  }

  showToast(option: ToastOptions): void {
    this.toast
      .create({
        message: option.message,
        duration: option.duration,
        position: option.position
      })
      .present();
  }
}
