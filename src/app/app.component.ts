import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public qrcode:string; '';    
  public windowsWidth:string = `${window.innerWidth > 600 ? 600 : window.innerWidth}px`;

  private html5QrCode;
  private cameraId;

  @ViewChild('video', {}) videoElement: ElementRef;
  @ViewChild('canvas', {}) canvas: ElementRef;

  ngOnInit(): void {
    this.getCameras();
  }

  getCameras() {
    Html5Qrcode.getCameras().then((devices:any[]) => {       
      if (devices && devices.length) {
        this.cameraId = devices[0].id;
        this.startCamera();
      }
    }).catch(err => {
      // handle err
    });
  }

  startCamera() {    
    this.html5QrCode = new Html5Qrcode("reader");
    this.html5QrCode.start(
      this.cameraId,     // retreived in the previous step.
      {
        fps: 10,    // sets the framerate to 10 frame per second
        qrbox: 250  // sets only 250 X 250 region of viewfinder to
                    // scannable, rest shaded.
      },
      qrCodeMessage => {
        // do something when code is read. For example:
        console.log(`QR Code detected: ${qrCodeMessage}`);
        this.qrcode = qrCodeMessage;
      },
      errorMessage => {
        // parse error, ideally ignore it. For example:
        //console.error(errorMessage);
        console.log(`QR Code no longer in front of camera.`);
      })
    .catch(err => {
      // Start failed, handle it. For example,
      console.log(`Unable to start scanning, error: ${err}`);
    });
  }


}
