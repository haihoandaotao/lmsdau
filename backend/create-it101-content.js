/**
 * CREATE LEARNING CONTENT FOR IT101 - Lập trình Web căn bản
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function createIT101Content() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const course = await Course.findOne({ code: 'IT101' });
    if (!course) throw new Error('IT101 not found');
    
    console.log(`📚 Course: ${course.title}\n`);
    
    // Clear existing modules
    await Module.deleteMany({ course: course._id });
    console.log('🗑️  Cleared old content\n');
    
    // ==================== MODULE 1 ====================
    const module1 = await Module.create({
      course: course._id,
      title: 'Module 1: Giới thiệu Python cơ bản',
      description: 'Làm quen với Python và viết chương trình đầu tiên',
      order: 1,
      isPublished: true,
      duration: '3 giờ',
      items: [
        {
          title: 'Python trong 100 giây',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=x7X9w_GIm1s',
          videoProvider: 'youtube',
          description: 'Tổng quan nhanh về Python - ngôn ngữ lập trình phổ biến nhất thế giới',
          videoDuration: 142,
          order: 1
        },
        {
          title: 'Python Tutorial for Beginners',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
          videoProvider: 'youtube',
          description: 'Hướng dẫn Python đầy đủ cho người mới bắt đầu - Lập trình với Mosh',
          videoDuration: 3729,
          order: 2
        },
        {
          title: 'Tài liệu: Python Basics',
          type: 'reading',
          content: String.raw`
            <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 900px;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">🐍 Python Basics - Cơ bản về Python</h1>
              
              <h2 style="color: #34495e; margin-top: 30px;">Python là gì?</h2>
              <p>Python là ngôn ngữ lập trình bậc cao, dễ học, dễ đọc và rất mạnh mẽ. Được tạo ra bởi Guido van Rossum vào năm 1991.</p>
              
              <div style="background-color: #e3f2fd; padding: 20px; border-left: 5px solid #2196f3; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1976d2;">🎯 Tại sao học Python?</h3>
                <ul style="line-height: 2;">
                  <li><strong>Dễ học:</strong> Cú pháp đơn giản, gần với ngôn ngữ tự nhiên</li>
                  <li><strong>Đa năng:</strong> Web, AI, Data Science, Automation, Game...</li>
                  <li><strong>Cộng đồng lớn:</strong> Hàng triệu developer và thư viện phong phú</li>
                  <li><strong>Lương cao:</strong> Top 3 ngôn ngữ có mức lương cao nhất</li>
                  <li><strong>Được sử dụng bởi:</strong> Google, Netflix, NASA, Instagram, Spotify</li>
                </ul>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Cài đặt Python</h2>
              
              <h3 style="color: #7f8c8d;">Bước 1: Download Python</h3>
              <p>Truy cập <a href="https://www.python.org/downloads/" target="_blank">python.org/downloads</a> và tải phiên bản mới nhất.</p>
              
              <h3 style="color: #7f8c8d;">Bước 2: Cài đặt</h3>
              <ul style="line-height: 2;">
                <li>Windows: Chạy file .exe, <strong>tick "Add Python to PATH"</strong></li>
                <li>Mac: Chạy file .pkg</li>
                <li>Linux: Thường đã có sẵn, hoặc dùng <code>apt install python3</code></li>
              </ul>
              
              <h3 style="color: #7f8c8d;">Bước 3: Kiểm tra</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Mở Terminal/Command Prompt và gõ:
python --version
# hoặc
python3 --version

# Kết quả: Python 3.11.0 (hoặc phiên bản khác)</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Chương trình Python đầu tiên</h2>
              
              <h3 style="color: #7f8c8d;">Hello World</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Tạo file hello.py
print("Hello, World!")
print("Chào mừng đến với Python!")</code></pre>
              
              <p>Chạy chương trình:</p>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>python hello.py</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Biến và Kiểu dữ liệu</h2>
              
              <h3 style="color: #7f8c8d;">Biến (Variables)</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Số nguyên
age = 25
year = 2024

# Số thực
rate = 99.99
pi = 3.14159

# Chuỗi (String)
name = "Nguyễn Văn A"
message = 'Python is awesome!'

# Boolean
is_student = True
has_license = False

# In ra màn hình
print(f"Tên: {name}, Tuổi: {age}")
print(f"Số: {rate}")</code></pre>
              
              <h3 style="color: #7f8c8d;">Các phép toán cơ bản</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Toán học
a = 10
b = 3

print(a + b)   # Cộng: 13
print(a - b)   # Trừ: 7
print(a * b)   # Nhân: 30
print(a / b)   # Chia: 3.333...
print(a // b)  # Chia lấy phần nguyên: 3
print(a % b)   # Chia lấy dư: 1
print(a ** b)  # Lũy thừa: 1000</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Nhập xuất dữ liệu</h2>
              
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Nhập dữ liệu từ bàn phím
name = input("Nhập tên của bạn: ")
age = input("Nhập tuổi: ")

# Chuyển đổi kiểu dữ liệu
age = int(age)  # Chuyển string sang integer

# Xuất dữ liệu
print(f"Xin chào {name}!")
print(f"Bạn {age} tuổi.")
print(f"Năm sau bạn {age + 1} tuổi.")</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Comments (Chú thích)</h2>
              
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code># Đây là comment một dòng
# Python sẽ bỏ qua dòng này

"""
Đây là comment
nhiều dòng
(Multi-line comment)
"""

x = 5  # Comment có thể đặt cuối dòng code</code></pre>
              
              <div style="background-color: #fff3cd; padding: 20px; border-left: 5px solid #ffc107; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #856404;">💪 Bài tập thực hành</h3>
                <ol style="line-height: 2;">
                  <li>Viết chương trình nhập tên và in ra "Xin chào [tên]"</li>
                  <li>Nhập 2 số và tính tổng, hiệu, tích, thương</li>
                  <li>Tính diện tích hình chữ nhật (nhập chiều dài và rộng)</li>
                  <li>Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit (F = C × 9/5 + 32)</li>
                  <li>Nhập bán kính, tính chu vi và diện tích hình tròn</li>
                </ol>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">📚 Tài liệu tham khảo</h2>
              <ul style="line-height: 2;">
                <li><a href="https://docs.python.org/3/" target="_blank">Python Official Documentation</a></li>
                <li><a href="https://www.w3schools.com/python/" target="_blank">W3Schools Python Tutorial</a></li>
                <li><a href="https://realpython.com/" target="_blank">Real Python</a></li>
                <li><a href="https://www.learnpython.org/" target="_blank">LearnPython.org</a></li>
              </ul>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-top: 30px; text-align: center;">
                <h3 style="margin-top: 0;">🎉 Chúc mừng!</h3>
                <p style="margin-bottom: 0;">Bạn đã hoàn thành bài học đầu tiên về Python. Hãy thực hành các bài tập để nắm vững kiến thức!</p>
              </div>
            </div>
          `,
          readingTime: 25,
          order: 3
        }
      ]
    });
    console.log(`✅ Module 1 created (${module1.items.length} items)`);
    
    // ==================== MODULE 2 ====================
    const module2 = await Module.create({
      course: course._id,
      title: 'Module 2: Cấu trúc điều khiển',
      description: 'If-else, vòng lặp và cấu trúc điều khiển',
      order: 2,
      isPublished: true,
      duration: '4 giờ',
      items: [
        {
          title: 'Python If Else Statements',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=f4KOjWS_KZs',
          videoProvider: 'youtube',
          description: 'Học cách sử dụng câu lệnh điều kiện if, elif, else trong Python',
          videoDuration: 1200,
          order: 1
        },
        {
          title: 'Python Loops - For and While',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=94UHCEmprCY',
          videoProvider: 'youtube',
          description: 'Vòng lặp for và while trong Python - Cách lặp qua danh sách, range, và điều kiện',
          videoDuration: 1380,
          order: 2
        }
      ]
    });
    console.log(`✅ Module 2 created (${module2.items.length} items)`);
    
    // ==================== MODULE 3 ====================
    const module3 = await Module.create({
      course: course._id,
      title: 'Module 3: Functions và Modules',
      description: 'Hàm, tham số, return và sử dụng modules',
      order: 3,
      isPublished: true,
      duration: '3 giờ',
      items: [
        {
          title: 'Python Functions Tutorial',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
          videoProvider: 'youtube',
          description: 'Học cách tạo và sử dụng functions trong Python - Tham số, return, scope',
          videoDuration: 1620,
          order: 1
        },
        {
          title: 'Python Modules and Packages',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=GxCXiSkm6no',
          videoProvider: 'youtube',
          description: 'Import modules, tạo packages và tổ chức code Python',
          videoDuration: 1140,
          order: 2
        }
      ]
    });
    console.log(`✅ Module 3 created (${module3.items.length} items)`);
    
    // ==================== MODULE 4 ====================
    const module4 = await Module.create({
      course: course._id,
      title: 'Module 4: Object-Oriented Programming',
      description: 'Lập trình hướng đối tượng với Python',
      order: 4,
      isPublished: true,
      duration: '4 giờ',
      items: [
        {
          title: 'Python OOP Tutorial',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=Ej_02ICOIgs',
          videoProvider: 'youtube',
          description: 'Lập trình hướng đối tượng: Classes, Objects, Inheritance, Polymorphism',
          videoDuration: 3240,
          order: 1
        },
        {
          title: 'Tài liệu: OOP Concepts',
          type: 'reading',
          content: String.raw`
            <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #9b59b6; padding-bottom: 10px;">🎯 Object-Oriented Programming (OOP)</h1>
              
              <h2 style="color: #34495e; margin-top: 30px;">OOP là gì?</h2>
              <p>Lập trình hướng đối tượng là phương pháp lập trình tổ chức code thành các "objects" - đơn vị kết hợp dữ liệu và hành vi.</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">4 Nguyên lý cơ bản</h2>
              
              <div style="background-color: #e8f5e9; padding: 20px; border-left: 5px solid #4caf50; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2e7d32;">1. Encapsulation (Đóng gói)</h3>
                <p>Gom dữ liệu và phương thức xử lý dữ liệu vào một đơn vị (class).</p>
                <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private attribute
    
    def deposit(self, amount):
        self.__balance += amount
    
    def get_balance(self):
        return self.__balance</code></pre>
              </div>
              
              <div style="background-color: #e3f2fd; padding: 20px; border-left: 5px solid #2196f3; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1976d2;">2. Inheritance (Kế thừa)</h3>
                <p>Class con kế thừa thuộc tính và phương thức từ class cha.</p>
                <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>class Animal:
    def speak(self):
        pass

class Dog(Animal):  # Dog kế thừa Animal
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"</code></pre>
              </div>
              
              <div style="background-color: #fff3e0; padding: 20px; border-left: 5px solid #ff9800; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #e65100;">3. Polymorphism (Đa hình)</h3>
                <p>Các object khác nhau có thể xử lý cùng một message theo cách khác nhau.</p>
                <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>animals = [Dog(), Cat(), Dog()]

for animal in animals:
    print(animal.speak())  # Mỗi con vật "speak" khác nhau</code></pre>
              </div>
              
              <div style="background-color: #fce4ec; padding: 20px; border-left: 5px solid #e91e63; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #880e4f;">4. Abstraction (Trừu tượng)</h3>
                <p>Ẩn chi tiết phức tạp, chỉ hiển thị tính năng cần thiết.</p>
                <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2</code></pre>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Ví dụ thực tế</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []
    
    def add_grade(self, grade):
        self.grades.append(grade)
    
    def get_average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)
    
    def display_info(self):
        print(f"Student: {self.name}")
        print(f"ID: {self.student_id}")
        print(f"Average: {self.get_average():.2f}")

# Sử dụng
student1 = Student("Nguyễn Văn A", "SV001")
student1.add_grade(8.5)
student1.add_grade(9.0)
student1.add_grade(7.5)
student1.display_info()</code></pre>
              
              <div style="background-color: #d4edda; padding: 20px; border-left: 5px solid #28a745; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #155724;">✅ Bài tập</h3>
                <ol style="line-height: 2;">
                  <li>Tạo class Rectangle với thuộc tính width, height và method tính diện tích, chu vi</li>
                  <li>Tạo class Book với title, author, price. Thêm method discount()</li>
                  <li>Tạo class Employee kế thừa từ Person, thêm salary và position</li>
                  <li>Tạo hệ thống quản lý thư viện với class Book và Library</li>
                </ol>
              </div>
            </div>
          `,
          readingTime: 30,
          order: 2
        }
      ]
    });
    console.log(`✅ Module 4 created (${module4.items.length} items)`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! IT101 content created:');
    console.log(`   📚 4 modules total`);
    console.log(`   📖 ${module1.items.length + module2.items.length + module3.items.length + module4.items.length} items total`);
    console.log(`   🎥 Real Python tutorial videos from YouTube`);
    console.log(`   📝 Detailed Vietnamese reading materials`);
    console.log('='.repeat(60));
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createIT101Content();
