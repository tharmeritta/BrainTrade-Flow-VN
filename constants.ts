import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 'intro',
    title: { en: '1. Introduction', vn: '1. Giới thiệu' },
    timeLimit: '1 min',
    description: { en: 'Build trust and qualify immediately.', vn: 'Xây dựng lòng tin và phân loại ngay lập tức.' },
    points: [
      {
        id: 'intro_1',
        text: { 
          en: 'Introduce yourself: Name, Company, Reason for call.', 
          vn: 'Giới thiệu bản thân: Tên, Công ty, Lý do cuộc gọi.' 
        }
      },
      {
        id: 'intro_2',
        text: { 
          en: 'Qualify: Do customers have experience in financial market? (Yes/No)', 
          vn: 'Phân loại: Khách hàng có kinh nghiệm thị trường tài chính không? (Có/Không)' 
        },
        isChecklist: true
      }
    ]
  },
  {
    id: 'kyc',
    title: { en: '2. KYC + Chemistry', vn: '2. Thấu hiểu khách hàng (KYC)' },
    timeLimit: '<= 30 mins',
    description: { en: 'Deep dive into customer needs and pain points.', vn: 'Tìm hiểu sâu về nhu cầu và nỗi đau của khách hàng.' },
    points: [
      {
        id: 'kyc_1',
        text: { en: 'Source of income / Profession', vn: 'Nguồn thu nhập / Nghề nghiệp' }
      },
      {
        id: 'kyc_2',
        text: { en: 'Life pain point (Financial goals, family pressure)', vn: 'Nỗi đau cuộc sống (Mục tiêu tài chính, áp lực gia đình)' }
      },
      {
        id: 'kyc_3',
        text: { en: 'Background pain relevant to trading', vn: 'Nỗi đau liên quan (Thua lỗ trước đây, thiếu kiến thức)' }
      }
    ]
  },
  {
    id: 'platform',
    title: { en: '3. Platform Call', vn: '3. Giới thiệu Nền tảng' },
    timeLimit: '<= 20 mins',
    description: { en: 'Demonstrate value and solution.', vn: 'Chứng minh giá trị và giải pháp.' },
    points: [
      {
        id: 'plat_1',
        text: { en: 'Website Introduction (Credibility)', vn: 'Giới thiệu Website (Uy tín)' }
      },
      {
        id: 'plat_2',
        text: { en: 'Package Explanation (Tiers/Benefits)', vn: 'Giải thích Gói dịch vụ (Các hạng mức/Lợi ích)' }
      },
      {
        id: 'plat_3',
        text: { en: 'Show Package Content + View Demo Section', vn: 'Nội dung gói + Xem mục Demo' }
      },
      {
        id: 'plat_4',
        text: { en: 'Highlight: Monthly limited queries for AI', vn: 'Điểm nhấn: Giới hạn truy vấn AI hàng tháng' }
      }
    ]
  },
  {
    id: 'close',
    title: { en: '4. Close Deal', vn: '4. Chốt đơn' },
    timeLimit: '<= 15 mins',
    description: { en: 'Guide through payment and activation.', vn: 'Hướng dẫn thanh toán và kích hoạt.' },
    points: [
      {
        id: 'close_1',
        text: { en: 'Register Account', vn: 'Đăng ký tài khoản' },
        isChecklist: true
      },
      {
        id: 'close_2',
        text: { en: 'Buy the package', vn: 'Mua gói dịch vụ' },
        isChecklist: true
      },
      {
        id: 'close_3',
        text: { en: 'Choose payment option', vn: 'Chọn phương thức thanh toán' },
        isChecklist: true
      },
      {
        id: 'close_4',
        text: { en: 'Complete transaction', vn: 'Hoàn tất giao dịch' },
        isChecklist: true
      },
      {
        id: 'close_5',
        text: { en: 'Show account balance / Confirmation', vn: 'Hiển thị số dư tài khoản / Xác nhận' },
        isChecklist: true
      }
    ]
  }
];
