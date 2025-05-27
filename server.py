#!/usr/bin/env python3
"""
简单的HTTP服务器，用于测试PWA功能
支持HTTPS（PWA需要HTTPS环境）
"""

import http.server
import socketserver
import ssl
import os
import mimetypes

class PWAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加PWA所需的HTTP头
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        # 添加Service Worker相关头
        if self.path.endswith('/sw.js'):
            self.send_header('Service-Worker-Allowed', '/')
            self.send_header('Content-Type', 'application/javascript')
        
        # 添加manifest.json的正确MIME类型
        if self.path.endswith('/manifest.json'):
            self.send_header('Content-Type', 'application/manifest+json')
        
        super().end_headers()

def run_server(port=8000, use_https=False):
    """运行HTTP/HTTPS服务器"""
    
    handler = PWAHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        if use_https:
            # 创建自签名证书（仅用于测试）
            context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            # 如果没有证书文件，创建临时的自签名证书
            if not os.path.exists('server.pem'):
                print("创建临时自签名证书...")
                os.system('openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"')
            
            try:
                context.load_cert_chain('server.pem')
                httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
                protocol = "HTTPS"
            except Exception as e:
                print(f"HTTPS设置失败，使用HTTP: {e}")
                protocol = "HTTP"
                use_https = False
        else:
            protocol = "HTTP"
        
        print(f"PWA测试服务器启动成功!")
        print(f"协议: {protocol}")
        print(f"地址: {'https' if use_https else 'http'}://localhost:{port}")
        print(f"访问: {'https' if use_https else 'http'}://localhost:{port}/index.html")
        print("\n注意:")
        print("- PWA功能需要HTTPS环境才能完全工作")
        print("- 如果使用自签名证书，浏览器会显示安全警告，请选择继续访问")
        print("- 在Chrome中可以通过 chrome://flags/#unsafely-treat-insecure-origin-as-secure 来测试HTTP环境下的PWA")
        print("\n按 Ctrl+C 停止服务器")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='PWA测试服务器')
    parser.add_argument('--port', type=int, default=8000, help='端口号 (默认: 8000)')
    parser.add_argument('--https', action='store_true', help='使用HTTPS (推荐用于PWA测试)')
    
    args = parser.parse_args()
    
    run_server(args.port, args.https) 