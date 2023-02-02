import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  faqAboutMonexQuestions = [
    {
      ask: 'Monex là ai?',
      aswer:
        'Monex là nền tảng công nghệ cung cấp và kết nối các giải pháp tài chính cá nhân thông minh.',
    },
    {
      ask: 'Monex có những dịch vụ nào?',
      aswer:
        'Dịch vụ của MONEX bao gồm : Dịch vụ ứng lương 24h và các dịch vụ sắp ra mắt trong thời gian tới như: ứng tiền siêu tốc 1h, mua trước thanh toán sau… Các dịch vụ này có giá trị khoản vay và thời hạn cho vay khác nhau, phù hợp với nhu cầu đa dạng của khách hàng.',
    },
    {
      ask: 'Dịch vụ ứng lương 24h là gì?',
      aswer:
        'Dịch vụ ứng lương 24h của Monex là dịch vụ ứng lương an toàn và nhanh chóng, dựa trên các thông tin do khách hàng cung cấp. Monex cam kết giải ngân cho khách hàng trong vòng 24 giờ tính từ thời điểm ký hợp đồng thành công.',
    },
    {
      ask: 'Đối tượng khách hàng (KH) của Monex?',
      aswer:
        'Monex hỗ trợ các KH có độ tuổi từ 18 tuổi trở lên, là công dân Việt Nam, có lịch sử tín dụng tốt và đầy đủ năng lực hành vi dân sự.',
    },
    {
      ask: 'Đối tác của Monex trong quy trình và hợp đồng với KH là ai?',
      aswer:
        'Tân Trường Thanh (TANTRGTHANH): Đối tác tài chính - đầu tư chiến lược của Monex, có vai trò cung cấp nguồn vốn cho KH của Monex. Mã số doanh nghiệp/ĐKKD số: 2601053803. NOVAON ONSIGN: Nhà cung cấp hợp tác với Monex về dịch vụ Chữ ký số, được cấp phép bởi Bộ Thông tin và Truyền thông.',
    },
  ];

  faqSignInQuestions = [
    {
      ask: 'Hạn mức và thời gian đăng ký ứng lương của Monex như thế nào?',
      aswer:
        'Monex hỗ trợ hạn mức ứng lương và thời gian ứng lương linh hoạt tuỳ thuộc vào hồ sơ của khách hàng. Khách hàng có thể đăng ký ứng lương từ 1-10 triệu với thời gian ứng lương là 1-30 ngày.',
    },
    {
      ask: 'Các giấy tờ cần cung cấp trong quá trình đăng ký ứng lương với Monex?',
      aswer: `CMND <br/>Giấy tờ của tài sản đảm bảo (hình ảnh đăng kí xe chính chủ).<br/>Sao kê lương.`,
    },
    {
      ask: 'Khi đăng ký khoản ứng lương cần những thủ tục gì? / Các bước hoàn thành đăng ký ứng lương tại Monex?',
      aswer: `Tất cả các thủ tục đăng ký ứng lương với Monex đều được thực hiện trực tuyến thông qua link sau : Monex - Tài chính thông minh<br/>
Bước 1. Đăng ký tài khoản và định danh Khách hàng trực tuyến (eKYC).<br/>
Bước 2. Cung cấp các thông tin và giấy tờ cần thiết giúp Monex đưa ra quyết định cho ứng lương. Quý khách vui lòng nhập đầy đủ thông tin cần thiết mà Monex đưa ra để được duyệt ứng lương.<br/>
Bước 3. Ký thư chấp thuận được Monex gửi về email của quý khách<br/>
Bước 4. Chọn hạn mức dựa trên nhu cầu ứng lương của quý khách.<br/>
Bước 5. Ký hợp đồng. Việc ký hợp đồng ứng lương được thực hiện trực tuyến. Sau khi hợp đồng đã sẵn sàng để ký, Monex sẽ gửi thông báo tới quý khách qua email. Quý khách vui lòng thực hiện theo hướng dẫn trong email để thực hiện ký hợp đồng ứng lương bằng chữ ký điện tử.<br/>
Bước 6. Giải ngân. Sau khi Hợp đồng ứng lương được ký, Monex sẽ thực hiện giải ngân khoản ứng lương cho Khách hàng bằng hình thức chuyển khoản vào tài khoản ngân hàng mà Khách hàng đăng ký.<br/>
Lưu ý : Thông báo của Monex sẽ được gửi cho quý khách bằng email và tin nhắn brandname dưới tên TANTRGTHANH.`,
    },
    {
      ask: 'Định danh khách hàng trực tuyến (eKYC) là gì?',
      aswer:
        'Định danh khách hàng trực tuyến (eKYC) là một thủ tục để Monex xác định và xác minh danh tính khách hàng đúng với những gì họ đã khai báo, đảm bảo tính hợp pháp và tuân thủ luật, quy định hiện hành. Thủ tục này giúp Monex cũng như các tổ chức tài chính đánh giá, giám sát rủi ro, ngăn ngừa gian lận, tránh các hoạt động rửa tiền, tài trợ khủng bố và các chương trình tham nhũng bất hợp pháp khác.',
    },
    {
      ask: 'Giải ngân bằng hình thức nào?',
      aswer:
        'Monex sẽ giải ngân qua hình thức chuyển khoản vào tài khoản chính chủ của KH.',
    },
    {
      ask: 'Tôi có phải đến văn phòng Monex để ký hợp đồng không?',
      aswer:
        'Tất cả các thủ tục đăng ký ứng lương với Monex đều được thực hiện trực tuyến. Hợp đồng ứng lương được gửi vào email khách hàng đã đăng ký. Vì vậy khách hàng không cần phải đến văn phòng Monex.',
    },
    {
      ask: 'Làm thế nào để người dùng biết là đã được giải ngân?',
      aswer:
        'Sau khi giải ngân, Monex sẽ gửi tin nhắn và email xác nhận đến cho quý khách. Hoặc quý khách có thể kiểm tra số dư trong tài khoản ngân hàng mà Quý khách đăng ký nhận giải ngân. Trong trường hợp không nhận được tin nhắn và email hoặc không thấy biến động số dư trong tài khoản ngân hàng, quý khách vui lòng liên hệ đến hotline 1900 234583 để được hỗ trợ kịp thời.',
    },
    {
      ask: 'Người dùng có thể xem thông tin khoản ứng lương ở đâu?',
      aswer:
        'Quý khách vui lòng đăng nhập tài khoản, sau đó vào mục “Quản lí khoản ứng” để xem thông tin.',
    },
  ];

  faqPaymentQuestions = [
    {
      ask: 'Thanh toán với Monex bằng hình thức nào?',
      aswer: `Khi đến hạn thanh toán Monex sẽ gửi thông tin qua email hoặc tin nhắn của quý khách, quý khách vui lòng làm theo các bước sau :<br/>
Bước 1. Quý khách vui lòng truy cập và đăng nhập vào website: ungluong0lai.vn<br/>
Bước 2. Tiếp tục vào mục Tất toán.<br/>
Bước 3. Thực hiện thanh toán bằng cách chuyển khoản vào số tài khoản mà Monex cung cấp và quản lý hoặc thanh toán trực tiếp qua cổng thanh toán Gpay (có hướng dẫn chi tiết trên website).<br/>
Trong thời gian tới, Monex sẽ cung cấp các kênh thanh toán đa dạng, phù hợp với thói quen và tiện lợi cho khách hàng.`,
    },
    {
      ask: 'Monex có gia hạn hoặc hỗ trợ ứng lương lại không?',
      aswer: `Monex quy định ngày thanh toán cố định là ngày 15 hàng tháng (hỗ trợ thanh toán online đến 23h59). Quý khách hàng được ứng lại nhiều lần trong tháng nếu không có khoản nợ tồn đọng trước đó.`,
    },
    {
      ask: 'Tại sao người dùng phải thanh toán đúng hạn?',
      aswer: `Thanh toán đúng hạn giúp quý khách được chấm điểm tín dụng uy tín (dễ dàng được phê duyệt hồ sơ trong những lần ứng tiếp theo) và không phát sinh phí trả chậm`,
    },
    {
      ask: 'Phí trả chậm được tính như thế nào?',
      aswer: `Phí trả chậm của Monex cố định là 100.000 đồng/lần trả chậm.`,
    },
    {
      ask: 'Người dùng có được nâng hạn mức trong lần ứng lương tiếp theo không?',
      aswer: `Hệ thống Monex căn cứ vào điểm tín dụng và quá trình chi tiêu của bạn để xác định hạn mức ứng lương tối đa`,
    },
    {
      ask: 'Nếu có các vấn đề phát sinh người dùng có thể liên hệ với Monex bằng hình thức nào?',
      aswer: `Quý khách hàng liên hệ trực tiếp tổng đài 1900 234 583 hoặc gửi email đến địa chỉ: support@monex.vn để được hỗ trợ.`,
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
