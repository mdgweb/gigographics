import sys
import os
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1]))
from server import app as application