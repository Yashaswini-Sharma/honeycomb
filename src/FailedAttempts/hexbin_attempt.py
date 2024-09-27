import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import BoundaryNorm, ListedColormap

def hexbin_plot_with_percentages(total_points, percentage_colors, gridsize=30, seed=0):
    """
    Create a hexbin plot with specific percentages of hexagons in different colors.

    Parameters:
    - total_points: Total number of (x, y) points to generate.
    - percentage_colors: List of tuples, each containing a percentage (as a float) and a color (as a string).
    - gridsize: Size of the hexbin grid. Default is 30.
    - seed: Random seed for reproducibility. Default is 0.
    """
    # Generate example data
    np.random.seed(seed)
    x = np.random.randn(total_points)
    y = np.random.randn(total_points)

    # Create initial hexbin plot to get counts
    plt.figure(figsize=(10, 6))
    hb = plt.hexbin(x, y, gridsize=gridsize, mincnt=1)
    counts = hb.get_array()
    plt.close()

    # Calculate cumulative thresholds based on percentages
    percentages = [p[0] for p in percentage_colors]
    thresholds = [0] + list(np.cumsum(percentages))

    # Create boundaries for normalization, excluding the first element
    boundaries = np.quantile(counts, thresholds[1:])

    # Create a custom colormap with specified colors
    colors = [p[1] for p in percentage_colors]
    cmap = ListedColormap(colors)
    norm = BoundaryNorm(boundaries=np.concatenate(([0], boundaries)), ncolors=len(colors))

    # Create the plot with custom colormap
    plt.figure(figsize=(10, 6))
    hb = plt.hexbin(x, y, gridsize=gridsize, cmap=cmap, norm=norm, mincnt=1)

    # Add color bar with labels for the percentage ranges
    cb = plt.colorbar(hb, label='Counts')
    cb.set_ticks([0] + list(boundaries))
    cb.set_ticklabels([f'{int(p*100)}%' for p in [0] + percentages])

    # Add labels and title
    plt.xlabel('X axis')
    plt.ylabel('Y axis')
    plt.title('Hexbin Plot with Custom Color Percentages')

    # Save the plot to a file
    plt.savefig('hexbin_plot_custom_percentages.png', bbox_inches='tight', pad_inches=0.1)
    plt.show()

    print("Plot saved as 'hexbin_plot_custom_percentages.png'")

# Define total points and percentage colors
total_points = 1000
percentage_colors = [(0.25, 'blue'), (0.50, 'green'), (0.25, 'red')]

# Create the hexbin plot
hexbin_plot_with_percentages(total_points, percentage_colors)
