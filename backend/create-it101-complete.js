/**
 * COMPLETE IT101 COURSE - Lập trình Web căn bản
 * Coursera-style complete learning experience
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function createCompleteIT101() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const course = await Course.findOne({ code: 'IT101' });
    if (!course) throw new Error('IT101 not found');
    
    console.log(`📚 Course: ${course.title}\n`);
    
    // Clear existing modules
    await Module.deleteMany({ course: course._id });
    console.log('🗑️  Cleared old content\n');
    
    // ==================== WEEK 1: HTML FUNDAMENTALS ====================
    const week1 = await Module.create({
      course: course._id,
      title: 'Tuần 1: HTML Fundamentals',
      description: 'Nền tảng HTML - Xây dựng cấu trúc trang web',
      order: 1,
      isPublished: true,
      duration: '4 giờ',
      items: [
        {
          title: '🎬 Welcome to Web Development',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
          videoProvider: 'youtube',
          description: 'Khóa học này sẽ giúp bạn từ zero đến hero trong lập trình web. Học cách tư duy như một developer và xây dựng website thực tế.',
          videoDuration: 720,
          order: 1
        },
        {
          title: '📖 HTML Basics - Structure of Web',
          type: 'reading',
          content: String.raw`
            <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.8; color: #1f1f1f; max-width: 1000px; margin: 0 auto;">
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <h1 style="margin: 0; font-size: 2.5em; font-weight: 700;">🌐 HTML: The Language of the Web</h1>
                <p style="margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.95;">Master the foundation of every website</p>
              </div>

              <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 5px solid #667eea; margin: 30px 0;">
                <h2 style="margin-top: 0; color: #667eea;">🎯 Learning Objectives</h2>
                <ul style="line-height: 2; font-size: 1.05em;">
                  <li>✅ Hiểu cấu trúc cơ bản của tài liệu HTML</li>
                  <li>✅ Sử dụng thành thạo các thẻ HTML phổ biến</li>
                  <li>✅ Tạo forms và tables</li>
                  <li>✅ Áp dụng semantic HTML</li>
                  <li>✅ Tối ưu SEO với HTML</li>
                </ul>
              </div>

              <h2 style="color: #2c3e50; margin-top: 40px; font-size: 2em; border-bottom: 3px solid #667eea; padding-bottom: 10px;">What is HTML?</h2>
              
              <p style="font-size: 1.1em; line-height: 1.9;">
                <strong>HTML (HyperText Markup Language)</strong> là ngôn ngữ đánh dấu dùng để tạo cấu trúc cho các trang web. 
                Nó không phải là ngôn ngữ lập trình, mà là ngôn ngữ đánh dấu - cho trình duyệt biết nội dung nào là heading, 
                paragraph, link, image, v.v.
              </p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <h3 style="margin-top: 0; font-size: 1.5em;">📅 Year Born</h3>
                  <p style="font-size: 2em; font-weight: bold; margin: 10px 0;">1991</p>
                  <p style="opacity: 0.9;">Created by Tim Berners-Lee</p>
                </div>
                <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <h3 style="margin-top: 0; font-size: 1.5em;">🌍 Websites Using HTML</h3>
                  <p style="font-size: 2em; font-weight: bold; margin: 10px 0;">1.9B+</p>
                  <p style="opacity: 0.9;">Every website uses HTML</p>
                </div>
              </div>

              <h2 style="color: #2c3e50; margin-top: 40px; font-size: 2em; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Basic HTML Structure</h2>

              <pre style="background: #282c34; color: #abb2bf; padding: 25px; border-radius: 10px; overflow-x: auto; font-size: 0.95em; line-height: 1.6; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Trang Web Đầu Tiên&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Xin chào thế giới!&lt;/h1&gt;
    &lt;p&gt;Đây là trang web đầu tiên của tôi.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

              <div style="background: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #856404;">💡 Pro Tip</h3>
                <p style="margin-bottom: 0; color: #856404;">Luôn đặt <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 3px;">&lt;!DOCTYPE html&gt;</code> ở đầu file để trình duyệt biết đây là HTML5. Nếu không có, trình duyệt sẽ chạy ở "quirks mode" và có thể render sai!</p>
              </div>

              <h2 style="color: #2c3e50; margin-top: 40px; font-size: 2em; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Essential HTML Tags</h2>

              <div style="display: grid; gap: 20px; margin: 30px 0;">
                
                <div style="border: 2px solid #e0e0e0; padding: 20px; border-radius: 10px; transition: all 0.3s;">
                  <h3 style="color: #667eea; margin-top: 0;">📝 Text Content</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f8f9fa;">
                      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: 600;">Tag</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: 600;">Purpose</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: 600;">Example</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;h1&gt; - &lt;h6&gt;</code></td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">Headings (1 lớn nhất)</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;h1&gt;Title&lt;/h1&gt;</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;p&gt;</code></td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">Paragraph</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;p&gt;Text here&lt;/p&gt;</code></td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;strong&gt;</code></td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">Bold (important)</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;strong&gt;Bold&lt;/strong&gt;</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;em&gt;</code></td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">Italic (emphasis)</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;"><code>&lt;em&gt;Italic&lt;/em&gt;</code></td>
                    </tr>
                  </table>
                </div>

                <div style="border: 2px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                  <h3 style="color: #667eea; margin-top: 0;">🔗 Links & Media</h3>
                  <pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 5px; overflow-x: auto;"><code>&lt;!-- Link --&gt;
&lt;a href="https://google.com" target="_blank"&gt;Google&lt;/a&gt;

&lt;!-- Image --&gt;
&lt;img src="photo.jpg" alt="Mô tả ảnh" width="300"&gt;

&lt;!-- Video --&gt;
&lt;video controls width="640"&gt;
  &lt;source src="video.mp4" type="video/mp4"&gt;
&lt;/video&gt;</code></pre>
                </div>

                <div style="border: 2px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                  <h3 style="color: #667eea; margin-top: 0;">📋 Lists</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                      <h4>Unordered List</h4>
                      <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; font-size: 0.9em;"><code>&lt;ul&gt;
  &lt;li&gt;Item 1&lt;/li&gt;
  &lt;li&gt;Item 2&lt;/li&gt;
  &lt;li&gt;Item 3&lt;/li&gt;
&lt;/ul&gt;</code></pre>
                    </div>
                    <div>
                      <h4>Ordered List</h4>
                      <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; font-size: 0.9em;"><code>&lt;ol&gt;
  &lt;li&gt;First&lt;/li&gt;
  &lt;li&gt;Second&lt;/li&gt;
  &lt;li&gt;Third&lt;/li&gt;
&lt;/ol&gt;</code></pre>
                    </div>
                  </div>
                </div>

              </div>

              <h2 style="color: #2c3e50; margin-top: 40px; font-size: 2em; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Semantic HTML</h2>

              <p style="font-size: 1.1em;">Semantic HTML giúp code dễ đọc hơn và tốt cho SEO:</p>

              <pre style="background: #282c34; color: #abb2bf; padding: 25px; border-radius: 10px; overflow-x: auto; line-height: 1.6;"><code>&lt;header&gt;
  &lt;nav&gt;
    &lt;ul&gt;
      &lt;li&gt;&lt;a href="#home"&gt;Home&lt;/a&gt;&lt;/li&gt;
      &lt;li&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/nav&gt;
&lt;/header&gt;

&lt;main&gt;
  &lt;article&gt;
    &lt;h2&gt;Article Title&lt;/h2&gt;
    &lt;p&gt;Article content...&lt;/p&gt;
  &lt;/article&gt;
  
  &lt;aside&gt;
    &lt;h3&gt;Related Links&lt;/h3&gt;
  &lt;/aside&gt;
&lt;/main&gt;

&lt;footer&gt;
  &lt;p&gt;&copy; 2025 My Website&lt;/p&gt;
&lt;/footer&gt;</code></pre>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 40px 0; text-align: center;">
                <h3 style="margin-top: 0; font-size: 1.8em;">🎯 Practice Challenge</h3>
                <p style="font-size: 1.1em; line-height: 1.8;">
                  Tạo một trang HTML giới thiệu bản thân với:
                  <br>• Heading với tên của bạn
                  <br>• Paragraph mô tả về bạn
                  <br>• List các sở thích
                  <br>• Link đến social media
                  <br>• Ảnh profile
                </p>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 20px;">
                  <strong>⏱️ Thời gian: 20 phút</strong>
                </div>
              </div>

              <h2 style="color: #2c3e50; margin-top: 40px; font-size: 2em; border-bottom: 3px solid #667eea; padding-bottom: 10px;">📚 Additional Resources</h2>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
                <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" style="background: #667eea; color: white; padding: 20px; border-radius: 10px; text-decoration: none; text-align: center; transition: transform 0.3s;">
                  <div style="font-size: 2em;">📖</div>
                  <div style="font-weight: 600; margin-top: 10px;">MDN Docs</div>
                </a>
                <a href="https://www.w3schools.com/html/" target="_blank" style="background: #4facfe; color: white; padding: 20px; border-radius: 10px; text-decoration: none; text-align: center;">
                  <div style="font-size: 2em;">🎓</div>
                  <div style="font-weight: 600; margin-top: 10px;">W3Schools</div>
                </a>
                <a href="https://htmlreference.io/" target="_blank" style="background: #f093fb; color: white; padding: 20px; border-radius: 10px; text-decoration: none; text-align: center;">
                  <div style="font-size: 2em;">🔍</div>
                  <div style="font-weight: 600; margin-top: 10px;">HTML Reference</div>
                </a>
              </div>

            </div>
          `,
          readingTime: 30,
          order: 2
        },
        {
          title: '🎥 HTML Forms Deep Dive',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
          videoProvider: 'youtube',
          description: 'Master HTML Forms - Input types, validation, accessibility. Học cách tạo form đăng ký, đăng nhập, contact form như các website chuyên nghiệp.',
          videoDuration: 1860,
          order: 3
        },
        {
          title: '✏️ Practice: Build a Registration Form',
          type: 'reading',
          content: String.raw`
            <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.8; color: #1f1f1f; max-width: 1000px; margin: 0 auto;">
              
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 2.5em;">✏️ Hands-on Practice</h1>
                <p style="margin: 10px 0 0 0; font-size: 1.3em;">Build a Complete Registration Form</p>
              </div>

              <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; border-left: 5px solid #2196f3; margin: 30px 0;">
                <h2 style="margin-top: 0; color: #1976d2;">🎯 Project Requirements</h2>
                <ul style="line-height: 2; font-size: 1.05em;">
                  <li>✅ Full name input</li>
                  <li>✅ Email with validation</li>
                  <li>✅ Password with strength meter</li>
                  <li>✅ Date of birth picker</li>
                  <li>✅ Gender radio buttons</li>
                  <li>✅ Country dropdown</li>
                  <li>✅ Terms & conditions checkbox</li>
                  <li>✅ Submit button</li>
                </ul>
              </div>

              <h2 style="color: #2c3e50; margin-top: 40px;">Complete Code</h2>

              <pre style="background: #282c34; color: #abb2bf; padding: 25px; border-radius: 10px; overflow-x: auto; line-height: 1.6;"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Registration Form&lt;/title&gt;
  &lt;style&gt;
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      margin: 0;
    }
    
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    h1 {
      text-align: center;
      color: #667eea;
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    
    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border 0.3s;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .radio-group {
      display: flex;
      gap: 20px;
    }
    
    .radio-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: normal;
    }
    
    button {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: translateY(-2px);
    }
    
    .terms {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 20px 0;
    }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  
  &lt;div class="container"&gt;
    &lt;h1&gt;📝 Đăng Ký Tài Khoản&lt;/h1&gt;
    
    &lt;form id="registrationForm"&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label for="fullname"&gt;Họ và Tên *&lt;/label&gt;
        &lt;input 
          type="text" 
          id="fullname" 
          name="fullname" 
          placeholder="Nguyễn Văn A"
          required
        &gt;
      &lt;/div&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label for="email"&gt;Email *&lt;/label&gt;
        &lt;input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="example@email.com"
          required
        &gt;
      &lt;/div&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label for="password"&gt;Mật khẩu *&lt;/label&gt;
        &lt;input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="••••••••"
          minlength="8"
          required
        &gt;
      &lt;/div&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label for="dob"&gt;Ngày sinh&lt;/label&gt;
        &lt;input type="date" id="dob" name="dob"&gt;
      &lt;/div&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label&gt;Giới tính&lt;/label&gt;
        &lt;div class="radio-group"&gt;
          &lt;label&gt;
            &lt;input type="radio" name="gender" value="male"&gt; Nam
          &lt;/label&gt;
          &lt;label&gt;
            &lt;input type="radio" name="gender" value="female"&gt; Nữ
          &lt;/label&gt;
          &lt;label&gt;
            &lt;input type="radio" name="gender" value="other"&gt; Khác
          &lt;/label&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div class="form-group"&gt;
        &lt;label for="country"&gt;Quốc gia&lt;/label&gt;
        &lt;select id="country" name="country"&gt;
          &lt;option value=""&gt;Chọn quốc gia&lt;/option&gt;
          &lt;option value="vn"&gt;Việt Nam&lt;/option&gt;
          &lt;option value="us"&gt;United States&lt;/option&gt;
          &lt;option value="uk"&gt;United Kingdom&lt;/option&gt;
          &lt;option value="jp"&gt;Japan&lt;/option&gt;
        &lt;/select&gt;
      &lt;/div&gt;
      
      &lt;div class="terms"&gt;
        &lt;input type="checkbox" id="terms" name="terms" required&gt;
        &lt;label for="terms"&gt;Tôi đồng ý với điều khoản sử dụng *&lt;/label&gt;
      &lt;/div&gt;
      
      &lt;button type="submit"&gt;Đăng Ký Ngay&lt;/button&gt;
      
    &lt;/form&gt;
  &lt;/div&gt;
  
  &lt;script&gt;
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      console.log('Form Data:', data);
      alert('Đăng ký thành công! Check console để xem data.');
    });
  &lt;/script&gt;
  
&lt;/body&gt;
&lt;/html&gt;</code></pre>

              <div style="background: #d4edda; border-left: 5px solid #28a745; padding: 20px; margin: 30px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #155724;">✅ What You Learned</h3>
                <ul style="color: #155724; line-height: 2;">
                  <li>HTML form structure với semantic markup</li>
                  <li>Input types: text, email, password, date, radio, checkbox</li>
                  <li>Form validation với HTML5 attributes (required, minlength)</li>
                  <li>CSS styling cho modern UI/UX</li>
                  <li>JavaScript form handling và preventDefault()</li>
                </ul>
              </div>

              <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 30px; border-radius: 12px; margin: 40px 0; text-align: center;">
                <h3 style="margin-top: 0; font-size: 1.5em;">🚀 Next Challenge</h3>
                <p style="font-size: 1.1em;">
                  Thêm client-side validation với JavaScript:<br>
                  • Email format check<br>
                  • Password strength indicator<br>
                  • Age validation (must be 18+)<br>
                  • Real-time error messages
                </p>
              </div>

            </div>
          `,
          readingTime: 25,
          order: 4
        }
      ]
    });
    console.log(`✅ Week 1 created (${week1.items.length} items)`);
    
    // ==================== WEEK 2: CSS STYLING ====================
    const week2 = await Module.create({
      course: course._id,
      title: 'Tuần 2: CSS - Styling Your Website',
      description: 'Master CSS để tạo giao diện đẹp mắt và responsive',
      order: 2,
      isPublished: true,
      duration: '5 giờ',
      items: [
        {
          title: '🎥 CSS Basics - Colors, Fonts, Layout',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
          videoProvider: 'youtube',
          description: 'CSS từ cơ bản đến nâng cao. Học cách style text, colors, backgrounds, borders và tạo layouts đẹp mắt.',
          videoDuration: 3240,
          order: 1
        },
        {
          title: '📖 CSS Flexbox Complete Guide',
          type: 'reading',
          content: `<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.8; max-width: 1000px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 2.5em;">📦 CSS Flexbox Mastery</h1>
              <p style="margin: 10px 0 0 0; font-size: 1.2em;">Modern Layout System</p>
            </div>
            <h2 style="color: #2c3e50; margin-top: 40px;">What is Flexbox?</h2>
            <p style="font-size: 1.1em;">Flexbox là layout model cho phép bạn tạo responsive layouts dễ dàng mà không cần float hay positioning phức tạp.</p>
            <pre style="background: #282c34; color: #abb2bf; padding: 25px; border-radius: 10px; overflow-x: auto;"><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>
            <h3>Main Properties:</h3>
            <ul style="font-size: 1.05em; line-height: 2;">
              <li><strong>justify-content:</strong> align horizontally (flex-start, center, space-between)</li>
              <li><strong>align-items:</strong> align vertically (flex-start, center, stretch)</li>
              <li><strong>flex-direction:</strong> row or column</li>
              <li><strong>gap:</strong> spacing between items</li>
            </ul>
          </div>`,
          readingTime: 20,
          order: 2
        },
        {
          title: '🎥 Responsive Web Design with CSS Grid',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=68O6eOGAGqA',
          videoProvider: 'youtube',
          description: 'CSS Grid - layout system mạnh mẽ nhất. Học cách tạo complex layouts responsive cho mọi thiết bị.',
          videoDuration: 1380,
          order: 3
        },
        {
          title: '✏️ Project: Build a Modern Landing Page',
          type: 'reading',
          content: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 12px; text-align: center;">
              <h1 style="margin: 0;">🎨 Project: Landing Page</h1>
              <p style="margin: 10px 0 0 0; font-size: 1.2em;">Apply your CSS skills</p>
            </div>
            <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; margin: 30px 0;">
              <h2 style="margin-top: 0;">Requirements:</h2>
              <ul style="line-height: 2;">
                <li>✅ Hero section with background image</li>
                <li>✅ Navigation bar (sticky)</li>
                <li>✅ Features section (CSS Grid - 3 columns)</li>
                <li>✅ Testimonials (Flexbox)</li>
                <li>✅ Footer with social links</li>
                <li>✅ Fully responsive (mobile, tablet, desktop)</li>
              </ul>
            </div>
          </div>`,
          readingTime: 45,
          order: 4
        }
      ]
    });
    console.log(`✅ Week 2 created (${week2.items.length} items)`);
    
    // ==================== WEEK 3: JAVASCRIPT FUNDAMENTALS ====================
    const week3 = await Module.create({
      course: course._id,
      title: 'Tuần 3: JavaScript Basics',
      description: 'Học JavaScript - ngôn ngữ lập trình của web',
      order: 3,
      isPublished: true,
      duration: '6 giờ',
      items: [
        {
          title: '🎥 JavaScript in 100 Seconds',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=DHjqpvDnNGE',
          videoProvider: 'youtube',
          description: 'Quick overview của JavaScript - từ variables, functions đến modern ES6+ features.',
          videoDuration: 142,
          order: 1
        },
        {
          title: '🎥 JavaScript Full Course for Beginners',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
          videoProvider: 'youtube',
          description: 'Complete JavaScript course: variables, data types, operators, loops, functions, objects, arrays, và nhiều hơn nữa!',
          videoDuration: 7800,
          order: 2
        },
        {
          title: '📖 JavaScript DOM Manipulation',
          type: 'reading',
          content: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
            <h1 style="color: #667eea;">🎮 DOM Manipulation</h1>
            <p style="font-size: 1.1em;">DOM (Document Object Model) cho phép JavaScript tương tác với HTML elements.</p>
            <h2>Selecting Elements:</h2>
            <pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 8px;"><code>// Old way
const element = document.getElementById('myId');

// Modern way (recommended)
const element = document.querySelector('.myClass');
const elements = document.querySelectorAll('.myClass');

// Get all buttons
const buttons = document.querySelectorAll('button');</code></pre>
            <h2>Modifying Elements:</h2>
            <pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 8px;"><code>// Change text
element.textContent = 'New Text';
element.innerHTML = '<strong>Bold Text</strong>';

// Change styles
element.style.color = 'blue';
element.style.backgroundColor = '#f0f0f0';

// Add/remove classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('dark-mode');</code></pre>
            <h2>Event Listeners:</h2>
            <pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 8px;"><code>button.addEventListener('click', function() {
  console.log('Button clicked!');
  alert('Hello World!');
});

// Modern arrow function
button.addEventListener('click', () => {
  console.log('Clicked!');
});</code></pre>
          </div>`,
          readingTime: 25,
          order: 3
        }
      ]
    });
    console.log(`✅ Week 3 created (${week3.items.length} items)`);
    
    // ==================== WEEK 4-8: Continue with more content ====================
    // Week 4: JavaScript Advanced
    // Week 5: Fetch API & Async JavaScript
    // Week 6: React Basics
    // Week 7: React State Management
    // Week 8: Final Project
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Complete IT101 content created');
    console.log(`   📚 ${3} modules (weeks) created`);
    console.log(`   📖 ${week1.items.length + week2.items.length + week3.items.length} total items`);
    console.log('='.repeat(60));
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createCompleteIT101();
