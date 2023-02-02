import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-products-choices',
  templateUrl: './insurance-products-choices.component.html',
  styleUrls: ['./insurance-products-choices.component.scss']
})
export class InsuranceProductsChoicesComponent implements OnInit {
  mainInsuranceCards = [
    {
      title:"Bảo hiểm xe máy",
      subtitle:"An toàn trên từng chặng đường",
      imgSrc: "assets/img/Moto.svg"
    },
    {
      title:"Bảo hiểm tai nạn",
      subtitle:"Bảo vệ bạn khỏi tại nạn cá nhân và gia đình 24/7",
      imgSrc: "assets/img/Disaster.svg"
    },
    {
      title:"Bảo hiểm sức khỏe",
      subtitle:"Chăm sóc toàn diện những người bạn yêu thương",
      imgSrc: "assets/img/Health.svg"
    },
    {
      title:"Bảo hiểm ô tô",
      subtitle:"An toàn trên từng chặng đường",
      imgSrc: "assets/img/Oto.svg"
    },
    {
      title:"Bảo hiểm tài sản",
      subtitle:"Bảo vệ ngôi nhà trước mọi rủi ro",
      imgSrc: "assets/img/Fortune-2.svg"
    }
  ]

  subInsuranceCards = [
    {
      title:"Bảo hiểm vật chất đời sống",
      subtitle:"Giá trị nhỏ, tiện ích lớn",
      imgSrc: "assets/img/Fortune.svg"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
