from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import plotly
import plotly.graph_objs as go
import numpy as np
from chat import get_response

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

@app.route('/index/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_input = request.form['userInput']
        return redirect(url_for('predict_dynamic_data', user_input=user_input))
    return render_template('index.html')

@app.route('/predict/userInput/<int:user_input>')
def predict_dynamic_data(user_input):
    # Convert user input to a numeric value indicating the number of data points
    try:
        num_points = int(user_input)
    except ValueError:
        num_points = 10  # Default number of points

    # Generate more dynamic data
    x_values = np.linspace(0, 10, num_points)
    y_values = np.sin(x_values) + np.random.normal(0, 0.1, num_points)  # Adding some noise for variability

    # Create a Plotly figure
    fig = go.Figure()

    # Add trace for the line plot
    fig.add_trace(go.Scatter(x=x_values, y=y_values, mode='lines+markers+text', name='Data',
                             text=[f'{y:.2f}' for y in y_values], textposition="top center"))

    # Enhance layout
    fig.update_layout(title='Dynamic Data Plot',
                      xaxis_title='X Axis',
                      yaxis_title='Y Axis',
                      showlegend=True)

    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('plot.html', graphJSON=graphJSON)

if __name__ == '__main__':
    app.run(debug=True)
