/**
 * UPDATE LEARNING CONTENT WITH FULL DETAILS
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function updateContent() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const course = await Course.findOne({ code: 'TEST101' });
    if (!course) throw new Error('TEST101 not found');
    
    console.log(`📚 Course: ${course.title}\n`);
    
    // Clear existing modules
    await Module.deleteMany({ course: course._id });
    console.log('🗑️  Cleared old content\n');
    
    // ==================== MODULE 1: INTRODUCTION ====================
    const module1 = await Module.create({
      course: course._id,
      title: 'Module 1: Introduction to Web Development',
      description: 'Welcome to the course! Learn about web development fundamentals and set up your learning environment.',
      order: 1,
      isPublished: true,
      duration: '2 giờ',
      items: [
        {
          title: 'Welcome to Web Development',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
          videoProvider: 'youtube',
          description: 'An introduction to web development - what it is, why it matters, and what you\'ll learn in this course.',
          videoDuration: 720,
          order: 1
        },
        {
          title: 'How the Internet Works',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">How the Internet Works</h1>
              
              <h2 style="color: #34495e; margin-top: 30px;">What is the Internet?</h2>
              <p>The Internet is a global network of interconnected computers that communicate using standardized protocols. It's the infrastructure that allows billions of devices worldwide to exchange information instantly.</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Key Concepts</h2>
              
              <h3 style="color: #7f8c8d;">1. Client-Server Model</h3>
              <p>The web operates on a client-server architecture:</p>
              <ul style="margin-left: 20px;">
                <li><strong>Client:</strong> Your web browser (Chrome, Firefox, Safari) that requests resources</li>
                <li><strong>Server:</strong> A computer that stores and serves web pages, images, and data</li>
                <li><strong>Request-Response Cycle:</strong> Client sends a request, server processes it and sends back a response</li>
              </ul>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">2. Protocols</h3>
              <p>Rules that govern how data is transmitted:</p>
              <ul style="margin-left: 20px;">
                <li><strong>HTTP/HTTPS:</strong> HyperText Transfer Protocol for web communication</li>
                <li><strong>TCP/IP:</strong> Transmission Control Protocol/Internet Protocol for reliable data delivery</li>
                <li><strong>DNS:</strong> Domain Name System converts domain names to IP addresses</li>
              </ul>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">3. What Happens When You Visit a Website?</h3>
              <ol style="margin-left: 20px;">
                <li>You type a URL (e.g., www.example.com) in your browser</li>
                <li>Browser contacts DNS server to find the IP address</li>
                <li>Browser sends HTTP request to the server at that IP address</li>
                <li>Server processes the request and sends back HTML, CSS, JavaScript</li>
                <li>Browser renders the page for you to see</li>
              </ol>
              
              <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #2c3e50;">💡 Key Takeaway</h4>
                <p style="margin-bottom: 0;">Understanding how the Internet works helps you become a better web developer. You'll know why things load slowly, how to optimize performance, and how to troubleshoot issues.</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Resources for Further Learning</h2>
              <ul style="margin-left: 20px;">
                <li>MDN Web Docs - How the Web Works</li>
                <li>Khan Academy - Internet 101</li>
                <li>Codecademy - What is the Internet?</li>
              </ul>
            </div>
          `,
          readingTime: 15,
          order: 2
        },
        {
          title: 'Setting Up Your Development Environment',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=V_2T5C03gw4',
          videoProvider: 'youtube',
          description: 'Learn how to set up Visual Studio Code, install extensions, and configure your workspace for web development.',
          videoDuration: 900,
          order: 3
        },
        {
          title: 'Your First HTML Page',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #e74c3c; padding-bottom: 10px;">Creating Your First HTML Page</h1>
              
              <p>HTML (HyperText Markup Language) is the foundation of every website. Let's create your first page!</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Basic HTML Structure</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;My First Webpage&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello, World!&lt;/h1&gt;
    &lt;p&gt;This is my first webpage.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Understanding Each Part</h2>
              
              <h3 style="color: #7f8c8d;">1. &lt;!DOCTYPE html&gt;</h3>
              <p>Declares that this is an HTML5 document. Always include this at the top.</p>
              
              <h3 style="color: #7f8c8d; margin-top: 15px;">2. &lt;html&gt;</h3>
              <p>The root element that contains all other elements. The <code>lang="en"</code> attribute specifies English language.</p>
              
              <h3 style="color: #7f8c8d; margin-top: 15px;">3. &lt;head&gt;</h3>
              <p>Contains metadata about the document:</p>
              <ul style="margin-left: 20px;">
                <li><strong>&lt;meta charset="UTF-8"&gt;:</strong> Character encoding for the page</li>
                <li><strong>&lt;meta name="viewport"...&gt;:</strong> Makes page responsive on mobile devices</li>
                <li><strong>&lt;title&gt;:</strong> Text that appears in browser tab</li>
              </ul>
              
              <h3 style="color: #7f8c8d; margin-top: 15px;">4. &lt;body&gt;</h3>
              <p>Contains all visible content that appears on the page.</p>
              
              <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #856404;">⚠️ Exercise</h4>
                <p style="margin-bottom: 0;">Create your own HTML page with a heading, paragraph, and an image. Save it as <code>index.html</code> and open it in your browser!</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Common HTML Tags</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #34495e; color: white;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Tag</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Purpose</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;h1&gt; - &lt;h6&gt;</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Headings (1 largest, 6 smallest)</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;h1&gt;Main Title&lt;/h1&gt;</code></td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;p&gt;</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Paragraph</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;p&gt;Text here&lt;/p&gt;</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;a&gt;</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Link</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;a href="url"&gt;Link&lt;/a&gt;</code></td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;img&gt;</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Image</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>&lt;img src="image.jpg" alt="Description"&gt;</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          `,
          readingTime: 20,
          order: 4
        }
      ]
    });
    console.log(`✅ Module 1 created (${module1.items.length} lessons)`);
    
    // ==================== MODULE 2: CORE CONCEPTS ====================
    const module2 = await Module.create({
      course: course._id,
      title: 'Module 2: HTML & CSS Fundamentals',
      description: 'Master the building blocks of web pages with HTML structure and CSS styling.',
      order: 2,
      isPublished: true,
      duration: '3 giờ',
      items: [
        {
          title: 'HTML Elements Deep Dive',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=salY_Sm6mv4',
          videoProvider: 'youtube',
          description: 'Comprehensive guide to HTML elements: semantic tags, forms, tables, lists, and more.',
          videoDuration: 1200,
          order: 1
        },
        {
          title: 'CSS Selectors and Properties',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #9b59b6; padding-bottom: 10px;">CSS: Making Your Pages Beautiful</h1>
              
              <p>CSS (Cascading Style Sheets) is what makes websites look good. It controls colors, fonts, layouts, and animations.</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Three Ways to Add CSS</h2>
              
              <h3 style="color: #7f8c8d;">1. Inline CSS (Not Recommended)</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>&lt;p style="color: blue; font-size: 18px;"&gt;Blue text&lt;/p&gt;</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">2. Internal CSS</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>&lt;head&gt;
  &lt;style&gt;
    p { color: blue; font-size: 18px; }
  &lt;/style&gt;
&lt;/head&gt;</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">3. External CSS (Best Practice)</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">CSS Selectors</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #9b59b6; color: white;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Selector</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Example</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Element</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>p { }</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Selects all &lt;p&gt; elements</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">Class</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>.intro { }</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Selects elements with class="intro"</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">ID</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>#header { }</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Selects element with id="header"</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">Descendant</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><code>div p { }</code></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Selects all &lt;p&gt; inside &lt;div&gt;</td>
                  </tr>
                </tbody>
              </table>
              
              <h2 style="color: #34495e; margin-top: 30px;">Common CSS Properties</h2>
              
              <h3 style="color: #7f8c8d;">Colors and Backgrounds</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>color: #3498db;              /* Text color */
background-color: #ecf0f1;  /* Background color */
background-image: url('bg.jpg'); /* Background image */</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">Text Styling</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>font-family: Arial, sans-serif;
font-size: 16px;
font-weight: bold;
text-align: center;
line-height: 1.5;</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">Box Model</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>width: 300px;
height: 200px;
padding: 20px;      /* Space inside */
margin: 10px;       /* Space outside */
border: 2px solid black;</code></pre>
              
              <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #155724;">✅ Practice Exercise</h4>
                <p style="margin-bottom: 0;">Create a CSS file that styles a webpage with a centered heading, colored background, and custom fonts. Experiment with different colors and sizes!</p>
              </div>
            </div>
          `,
          readingTime: 25,
          order: 2
        },
        {
          title: 'CSS Flexbox Layout',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=fYq5PXgSsbE',
          videoProvider: 'youtube',
          description: 'Learn Flexbox - the modern way to create flexible and responsive layouts in CSS.',
          videoDuration: 900,
          order: 3
        },
        {
          title: 'Responsive Design Principles',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #1abc9c; padding-bottom: 10px;">Responsive Web Design</h1>
              
              <p>Responsive design ensures your website looks great on all devices - desktops, tablets, and smartphones.</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Why Responsive Design?</h2>
              <ul style="margin-left: 20px; line-height: 2;">
                <li>📱 Over 50% of web traffic is from mobile devices</li>
                <li>🎯 Better user experience on all screen sizes</li>
                <li>🚀 Improved SEO rankings (Google prioritizes mobile-friendly sites)</li>
                <li>💰 Higher conversion rates and engagement</li>
              </ul>
              
              <h2 style="color: #34495e; margin-top: 30px;">Key Techniques</h2>
              
              <h3 style="color: #7f8c8d;">1. Viewport Meta Tag</h3>
              <p>Always include this in your &lt;head&gt;:</p>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">2. Fluid Layouts</h3>
              <p>Use percentages instead of fixed pixels:</p>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>/* Bad */
width: 960px;

/* Good */
width: 90%;
max-width: 1200px;</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">3. Media Queries</h3>
              <p>Apply different styles for different screen sizes:</p>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>/* Mobile first approach */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 80%;
    padding: 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: 60%;
    max-width: 1200px;
  }
}</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Common Breakpoints</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #1abc9c; color: white;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Device</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Breakpoint</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Media Query</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Mobile</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">< 768px</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Default (mobile first)</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;">Tablet</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">768px - 1023px</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">@media (min-width: 768px)</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Desktop</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">> 1024px</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">@media (min-width: 1024px)</td>
                  </tr>
                </tbody>
              </table>
              
              <div style="background-color: #cce5ff; padding: 15px; border-left: 4px solid #004085; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #004085;">🔍 Testing Tip</h4>
                <p style="margin-bottom: 0;">Use Chrome DevTools (F12) to test your responsive design. Click the device toolbar icon to simulate different screen sizes!</p>
              </div>
            </div>
          `,
          readingTime: 20,
          order: 4
        }
      ]
    });
    console.log(`✅ Module 2 created (${module2.items.length} lessons)`);
    
    // ==================== MODULE 3: ADVANCED TOPICS ====================
    const module3 = await Module.create({
      course: course._id,
      title: 'Module 3: JavaScript Essentials',
      description: 'Add interactivity to your websites with JavaScript programming.',
      order: 3,
      isPublished: true,
      duration: '4 giờ',
      items: [
        {
          title: 'JavaScript Basics',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          videoProvider: 'youtube',
          description: 'Learn JavaScript fundamentals: variables, data types, operators, and control structures.',
          videoDuration: 1500,
          order: 1
        },
        {
          title: 'DOM Manipulation',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #f39c12; padding-bottom: 10px;">The Document Object Model (DOM)</h1>
              
              <p>The DOM is a programming interface that allows JavaScript to interact with and modify HTML elements dynamically.</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">What is the DOM?</h2>
              <p>When a web page loads, the browser creates a Document Object Model - a tree structure representing all HTML elements. JavaScript can:</p>
              <ul style="margin-left: 20px; line-height: 2;">
                <li>📝 Change HTML content</li>
                <li>🎨 Modify CSS styles</li>
                <li>➕ Add or remove elements</li>
                <li>👂 Listen for user events (clicks, typing, etc.)</li>
              </ul>
              
              <h2 style="color: #34495e; margin-top: 30px;">Selecting Elements</h2>
              
              <h3 style="color: #7f8c8d;">By ID</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>const element = document.getElementById('myId');
console.log(element.textContent);</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">By Class Name</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>const elements = document.getElementsByClassName('myClass');
// Returns HTMLCollection (array-like)</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">Query Selector (Modern Way)</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>// Select first match
const element = document.querySelector('.myClass');

// Select all matches
const elements = document.querySelectorAll('p.intro');
elements.forEach(el => console.log(el));</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Manipulating Elements</h2>
              
              <h3 style="color: #7f8c8d;">Change Content</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>const heading = document.querySelector('h1');
heading.textContent = 'New Text';           // Plain text
heading.innerHTML = '&lt;em&gt;Italic Text&lt;/em&gt;'; // HTML content</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">Modify Styles</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>const box = document.querySelector('.box');
box.style.backgroundColor = 'blue';
box.style.padding = '20px';
box.style.borderRadius = '10px';</code></pre>
              
              <h3 style="color: #7f8c8d; margin-top: 20px;">Add/Remove Classes</h3>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>const button = document.querySelector('button');
button.classList.add('active');
button.classList.remove('inactive');
button.classList.toggle('highlight');  // Add if not present, remove if present</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Event Listeners</h2>
              <p>Make your page interactive by responding to user actions:</p>
              
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>// Click event
const button = document.querySelector('#myButton');
button.addEventListener('click', function() {
  alert('Button clicked!');
});

// Input event
const input = document.querySelector('#nameInput');
input.addEventListener('input', function(e) {
  console.log('User typed:', e.target.value);
});

// Form submit
const form = document.querySelector('#myForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent page reload
  console.log('Form submitted!');
});</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">Creating Elements</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px;"><code>// Create new element
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello!';
newDiv.className = 'greeting';

// Add to page
document.body.appendChild(newDiv);

// Remove element
const oldDiv = document.querySelector('.old');
oldDiv.remove();</code></pre>
              
              <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #856404;">💪 Challenge</h4>
                <p style="margin-bottom: 0;">Create a todo list app: Add button creates new items, clicking an item marks it complete, delete button removes it!</p>
              </div>
            </div>
          `,
          readingTime: 30,
          order: 2
        },
        {
          title: 'Functions and Events',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
          videoProvider: 'youtube',
          description: 'Master JavaScript functions, event handling, and callback functions.',
          videoDuration: 1080,
          order: 3
        },
        {
          title: 'Mini Project: Interactive Calculator',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #e74c3c; padding-bottom: 10px;">Build an Interactive Calculator</h1>
              
              <p>Let's put everything together and build a fully functional calculator using HTML, CSS, and JavaScript!</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Project Overview</h2>
              <p>We'll create a calculator that can:</p>
              <ul style="margin-left: 20px; line-height: 2;">
                <li>➕ Add, subtract, multiply, divide</li>
                <li>🔢 Handle decimal numbers</li>
                <li>🔄 Clear display</li>
                <li>✨ Show result on equals button</li>
              </ul>
              
              <h2 style="color: #34495e; margin-top: 30px;">HTML Structure</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>&lt;div class="calculator"&gt;
  &lt;input type="text" id="display" readonly&gt;
  &lt;div class="buttons"&gt;
    &lt;button onclick="clearDisplay()"&gt;C&lt;/button&gt;
    &lt;button onclick="appendToDisplay('7')"&gt;7&lt;/button&gt;
    &lt;button onclick="appendToDisplay('8')"&gt;8&lt;/button&gt;
    &lt;button onclick="appendToDisplay('9')"&gt;9&lt;/button&gt;
    &lt;button onclick="appendToDisplay('+')"&gt;+&lt;/button&gt;
    &lt;!-- More buttons... --&gt;
    &lt;button onclick="calculate()"&gt;=&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">CSS Styling</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>.calculator {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  background: #2c3e50;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

#display {
  width: 100%;
  height: 60px;
  font-size: 24px;
  text-align: right;
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  height: 60px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #34495e;
  color: white;
  transition: background 0.3s;
}

button:hover {
  background: #4a6278;
}

button:active {
  transform: scale(0.95);
}</code></pre>
              
              <h2 style="color: #34495e; margin-top: 30px;">JavaScript Logic</h2>
              <pre style="background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>let display = document.getElementById('display');

function appendToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = '';
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = 'Error';
  }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') {
    appendToDisplay(e.key);
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    appendToDisplay(e.key);
  } else if (e.key === 'Enter') {
    calculate();
  } else if (e.key === 'Escape') {
    clearDisplay();
  }
});</code></pre>
              
              <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #155724;">🎯 Challenge Yourself</h4>
                <p><strong>Enhancements to add:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 0;">
                  <li>Add backspace button to delete last character</li>
                  <li>Implement percentage calculation</li>
                  <li>Add memory functions (M+, M-, MR, MC)</li>
                  <li>Create a history of calculations</li>
                  <li>Add parentheses support for complex expressions</li>
                </ul>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">What You've Learned</h2>
              <ul style="margin-left: 20px; line-height: 2;">
                <li>✅ Combining HTML, CSS, and JavaScript</li>
                <li>✅ Event handling and user interaction</li>
                <li>✅ DOM manipulation in practice</li>
                <li>✅ Error handling with try-catch</li>
                <li>✅ Responsive design with Grid layout</li>
              </ul>
            </div>
          `,
          readingTime: 35,
          order: 4
        }
      ]
    });
    console.log(`✅ Module 3 created (${module3.items.length} lessons)`);
    
    // ==================== MODULE 4: REVIEW & ASSESSMENT ====================
    const module4 = await Module.create({
      course: course._id,
      title: 'Module 4: Course Review & Next Steps',
      description: 'Review what you\'ve learned and prepare for the final assessment.',
      order: 4,
      isPublished: true,
      duration: '2 giờ',
      items: [
        {
          title: 'Course Summary',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #16a085; padding-bottom: 10px;">🎓 Congratulations! Course Review</h1>
              
              <p style="font-size: 18px; color: #555;">You've completed an incredible journey through web development fundamentals. Let's review what you've mastered!</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Module 1: Introduction to Web Development</h2>
              <div style="background-color: #ecf0f1; padding: 20px; border-left: 5px solid #3498db; margin: 15px 0;">
                <h3 style="margin-top: 0;">Key Topics Covered:</h3>
                <ul style="line-height: 2;">
                  <li>How the Internet works (client-server model, protocols)</li>
                  <li>Setting up your development environment</li>
                  <li>Creating your first HTML page</li>
                  <li>Understanding HTML document structure</li>
                </ul>
                <p><strong>Skills Acquired:</strong> Basic HTML, development tools, web fundamentals</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Module 2: HTML & CSS Fundamentals</h2>
              <div style="background-color: #ecf0f1; padding: 20px; border-left: 5px solid #9b59b6; margin: 15px 0;">
                <h3 style="margin-top: 0;">Key Topics Covered:</h3>
                <ul style="line-height: 2;">
                  <li>HTML semantic elements and best practices</li>
                  <li>CSS selectors, properties, and the box model</li>
                  <li>Flexbox for modern layouts</li>
                  <li>Responsive design with media queries</li>
                </ul>
                <p><strong>Skills Acquired:</strong> Page structure, styling, responsive layouts</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Module 3: JavaScript Essentials</h2>
              <div style="background-color: #ecf0f1; padding: 20px; border-left: 5px solid #f39c12; margin: 15px 0;">
                <h3 style="margin-top: 0;">Key Topics Covered:</h3>
                <ul style="line-height: 2;">
                  <li>JavaScript fundamentals (variables, functions, control flow)</li>
                  <li>DOM manipulation and element selection</li>
                  <li>Event handling and user interaction</li>
                  <li>Building an interactive calculator project</li>
                </ul>
                <p><strong>Skills Acquired:</strong> Programming logic, interactivity, real-world projects</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">🏆 Your Achievements</h2>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                  <h3 style="margin: 0; font-size: 24px;">13</h3>
                  <p style="margin: 5px 0 0 0;">Lessons Completed</p>
                </div>
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                  <h3 style="margin: 0; font-size: 24px;">4</h3>
                  <p style="margin: 5px 0 0 0;">Modules Mastered</p>
                </div>
                <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                  <h3 style="margin: 0; font-size: 24px;">3</h3>
                  <p style="margin: 5px 0 0 0;">Technologies</p>
                </div>
                <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                  <h3 style="margin: 0; font-size: 24px;">1</h3>
                  <p style="margin: 5px 0 0 0;">Full Project</p>
                </div>
              </div>
              
              <h2 style="color: #34495e; margin-top: 40px;">📚 Next Steps in Your Learning Journey</h2>
              
              <h3 style="color: #7f8c8d;">Continue Learning:</h3>
              <ol style="line-height: 2.5;">
                <li><strong>Advanced JavaScript:</strong> ES6+, async/await, promises, APIs</li>
                <li><strong>Frontend Frameworks:</strong> React, Vue, or Angular</li>
                <li><strong>Backend Development:</strong> Node.js, Express, databases</li>
                <li><strong>Version Control:</strong> Git and GitHub</li>
                <li><strong>Web Design:</strong> UI/UX principles, Figma</li>
              </ol>
              
              <h3 style="color: #7f8c8d;">Practice Projects:</h3>
              <ul style="line-height: 2;">
                <li>🌐 Build a personal portfolio website</li>
                <li>📝 Create a blog with commenting system</li>
                <li>🛒 E-commerce product page</li>
                <li>🎮 Simple browser game</li>
                <li>📱 Responsive landing page for a business</li>
              </ul>
              
              <h3 style="color: #7f8c8d;">Resources for Continued Learning:</h3>
              <ul style="line-height: 2;">
                <li><strong>FreeCodeCamp:</strong> Free coding bootcamp with certifications</li>
                <li><strong>MDN Web Docs:</strong> Comprehensive web development documentation</li>
                <li><strong>JavaScript.info:</strong> In-depth JavaScript tutorial</li>
                <li><strong>CSS-Tricks:</strong> CSS techniques and best practices</li>
                <li><strong>GitHub:</strong> Explore open-source projects and contribute</li>
              </ul>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
                <h2 style="margin-top: 0; font-size: 28px;">🚀 You're Ready!</h2>
                <p style="font-size: 18px; margin: 10px 0;">You now have the foundational skills to build real websites. Keep practicing, keep building, and never stop learning!</p>
                <p style="font-style: italic; margin-top: 20px;">"The only way to learn programming is by writing programs." - Dennis Ritchie</p>
              </div>
            </div>
          `,
          readingTime: 15,
          order: 1
        },
        {
          title: 'Final Assessment Instructions',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
          videoProvider: 'youtube',
          description: 'Important information about the final assessment, quiz, and how to complete the course.',
          videoDuration: 600,
          order: 2
        },
        {
          title: 'Career Paths in Web Development',
          type: 'reading',
          content: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #2c3e50; border-bottom: 3px solid #e67e22; padding-bottom: 10px;">🎯 Career Paths in Web Development</h1>
              
              <p>Web development offers diverse career opportunities. Let's explore different paths you can take!</p>
              
              <h2 style="color: #34495e; margin-top: 30px;">Frontend Developer</h2>
              <div style="background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin: 15px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">What They Do:</h3>
                <p>Create the visual and interactive parts of websites that users see and interact with.</p>
                
                <h4 style="color: #1976d2;">Required Skills:</h4>
                <ul style="line-height: 2;">
                  <li>✅ HTML, CSS, JavaScript (you already know this!)</li>
                  <li>📦 React, Vue, or Angular frameworks</li>
                  <li>🎨 UI/UX design principles</li>
                  <li>📱 Responsive design and mobile-first approach</li>
                  <li>⚡ Performance optimization</li>
                </ul>
                
                <h4 style="color: #1976d2;">Average Salary:</h4>
                <p><strong>$70,000 - $120,000/year</strong> (varies by location and experience)</p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Backend Developer</h2>
              <div style="background-color: #f3e5f5; padding: 20px; border-radius: 10px; margin: 15px 0;">
                <h3 style="color: #7b1fa2; margin-top: 0;">What They Do:</h3>
                <p>Build server-side logic, databases, and APIs that power websites behind the scenes.</p>
                
                <h4 style="color: #7b1fa2;">Required Skills:</h4>
                <ul style="line-height: 2;">
                  <li>🖥️ Server-side languages (Node.js, Python, PHP, Java)</li>
                  <li>🗄️ Databases (MySQL, PostgreSQL, MongoDB)</li>
                  <li>🔌 RESTful APIs and GraphQL</li>
                  <li>🔐 Authentication and security</li>
                  <li>☁️ Cloud services (AWS, Azure, Google Cloud)</li>
                </ul>
                
                <h4 style="color: #7b1fa2;">Average Salary:</h4>
                <p><strong>$80,000 - $140,000/year</strong></p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Full Stack Developer</h2>
              <div style="background-color: #e8f5e9; padding: 20px; border-radius: 10px; margin: 15px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">What They Do:</h3>
                <p>Work on both frontend and backend, handling entire web applications from database to user interface.</p>
                
                <h4 style="color: #2e7d32;">Required Skills:</h4>
                <ul style="line-height: 2;">
                  <li>🌐 Frontend technologies (HTML, CSS, JS, React/Vue)</li>
                  <li>⚙️ Backend technologies (Node.js, Express, databases)</li>
                  <li>🔄 Version control (Git)</li>
                  <li>🚀 Deployment and DevOps basics</li>
                  <li>🎯 Project architecture and design patterns</li>
                </ul>
                
                <h4 style="color: #2e7d32;">Average Salary:</h4>
                <p><strong>$90,000 - $150,000/year</strong></p>
              </div>
              
              <h2 style="color: #34495e; margin-top: 30px;">Specialized Roles</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background-color: #e67e22; color: white;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Role</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Focus</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Salary Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>UI/UX Developer</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">User interface design + coding</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$65K - $110K</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>DevOps Engineer</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Deployment, CI/CD, infrastructure</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$95K - $160K</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Mobile Developer</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">iOS/Android apps, React Native</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$85K - $145K</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Web Performance Engineer</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">Site speed optimization</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$90K - $150K</td>
                  </tr>
                </tbody>
              </table>
              
              <h2 style="color: #34495e; margin-top: 40px;">🎓 How to Land Your First Job</h2>
              
              <div style="background-color: #fff3cd; padding: 20px; border-left: 5px solid #ffc107; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Build a Strong Portfolio</h3>
                <ul style="line-height: 2;">
                  <li>Create 3-5 impressive projects showcasing different skills</li>
                  <li>Deploy projects live (GitHub Pages, Netlify, Vercel)</li>
                  <li>Write clear README files explaining your projects</li>
                  <li>Include live demos and source code links</li>
                </ul>
              </div>
              
              <div style="background-color: #d1ecf1; padding: 20px; border-left: 5px solid #0c5460; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0c5460;">Network and Contribute</h3>
                <ul style="line-height: 2;">
                  <li>Contribute to open-source projects on GitHub</li>
                  <li>Attend local developer meetups and hackathons</li>
                  <li>Build a presence on LinkedIn and Twitter</li>
                  <li>Write blog posts about what you're learning</li>
                </ul>
              </div>
              
              <div style="background-color: #d4edda; padding: 20px; border-left: 5px solid #28a745; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #155724;">Never Stop Learning</h3>
                <ul style="line-height: 2;">
                  <li>Stay updated with new web technologies</li>
                  <li>Practice coding challenges (LeetCode, HackerRank)</li>
                  <li>Read documentation and tech blogs</li>
                  <li>Build side projects for fun and learning</li>
                </ul>
              </div>
              
              <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 25px; border-radius: 10px; margin-top: 30px; text-align: center;">
                <h3 style="margin-top: 0; font-size: 24px;">💼 Ready to Start Your Career?</h3>
                <p style="margin: 10px 0;">The tech industry is always hiring talented developers. With dedication and continuous learning, you can build an amazing career!</p>
              </div>
            </div>
          `,
          readingTime: 20,
          order: 3
        }
      ]
    });
    console.log(`✅ Module 4 created (${module4.items.length} lessons)`);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ SUCCESS! Full content created:');
    console.log(`   📚 4 modules total`);
    console.log(`   📖 ${module1.items.length + module2.items.length + module3.items.length + module4.items.length} lessons total`);
    console.log(`   🎥 Video content with real educational videos`);
    console.log(`   📝 Detailed reading materials with styled HTML`);
    console.log('='.repeat(50));
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateContent();
