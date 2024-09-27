from flask import Flask, request, jsonify, send_file
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import RegularPolygon
from collections import deque
import io

app = Flask(__name__)

def plot_random_honeycomb(easy, medium, hard, radius=1):
    n = easy + medium + hard
    color_map = {'easy': '#F9A500', 'medium': '#CD8DFF', 'hard': '#13A4E3'}
    directions = [(1, 0), (0, 1), (-1, 1), (-1, 0), (0, -1), (1, -1)]
    
    fig, ax = plt.subplots()
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    ax.set_aspect('equal')
    
    h_spacing = 3/2 * radius
    v_spacing = np.sqrt(3) * radius
    
    def hexagon_center(x, y):
        return (x * h_spacing, y * v_spacing + (x % 2) * (v_spacing / 2))
    
    def add_hexagon(x, y, color):
        hexagon = RegularPolygon(hexagon_center(x, y), numVertices=6, radius=radius, orientation=np.pi/6,
                                 edgecolor='k', facecolor=color)
        ax.add_patch(hexagon)
    
    queue = deque([(0, 0)])
    occupied = set(queue)
    question_types = ['easy'] * easy + ['medium'] * medium + ['hard'] * hard
    np.random.shuffle(question_types)  
    
    while question_types:
        x, y = queue.popleft()
        
        if question_types:
            question_type = question_types.pop()
            color = color_map[question_type]
            add_hexagon(x, y, color)
        
        for dx, dy in directions:
            new_x, new_y = x + dx, y + dy
            if (new_x, new_y) not in occupied:
                occupied.add((new_x, new_y))
                queue.append((new_x, new_y))
                
                if len(occupied) >= n:
                    break
    
    min_x, max_x = min(x for x, _ in occupied), max(x for x, _ in occupied)
    min_y, max_y = min(y for _, y in occupied), max(y for _, y in occupied)
    
    x_margin = radius * 1.5
    y_margin = radius * 1.5
    ax.set_xlim(min_x * h_spacing - x_margin, (max_x + 1) * h_spacing + x_margin)
    ax.set_ylim(min_y * v_spacing - y_margin, (max_y + 1) * v_spacing + y_margin)
    
    plt.grid(False)
    plt.axis('off')

    fig.canvas.draw()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, transparent=True)
    buf.seek(0)
    
    plt.close(fig)  
    
    return buf

@app.route('/generate_plot', methods=['POST'])
def generate_plot():
    data = request.json
    easy = data.get('easy_count', 0)
    medium = data.get('medium_count', 0)
    hard = data.get('hard_count', 0)
    
    buf = plot_random_honeycomb(easy, medium, hard)
    return send_file(buf, mimetype='image/png', as_attachment=True, download_name='honeycomb_plot.png')

if __name__ == '__main__':
    app.run(debug=True)
