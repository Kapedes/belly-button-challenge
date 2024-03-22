

const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
console.log(url)

d3.json(url).then(data => {
    console.log(data);
  });
  d3.json(url).then(data => {
    console.log(data.samples);
  });

// Promise pending for obtaining JSON data from URL
const dataPromise = d3.json(url);
    console.log("Data Promise: ", dataPromise);

// Set up variables and get data from JSON for charts 
var samples;
var meta_data;
d3.json(url).then(function (data) {
    let selector = d3.select("#selDataset");
    meta_data = data.metadata;
    samples = data.samples;
    data.names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });
    metaData(meta_data[0]);
    hbarChart(samples[0]);
    bubbleChart(samples[0]);
});

function optionChanged(value) {
    const selectedId = samples.find((item) => item.id === value);
    const demographicInfo = meta_data.find((item) => item.id == value);

    // Insterting Demographic Data
    metaData(demographicInfo);

    // Bar Chart
    hbarChart(selectedId);

    // Bubble Chart
    bubbleChart(selectedId);

}

function metaData(demographicInfo) {
    let demoSelect = d3.select("#sample-metadata");

    demoSelect.html(
        `id: ${demographicInfo.id} <br> 
      ethnicity: ${demographicInfo.ethnicity} <br>
    gender: ${demographicInfo.gender} <br>
    age: ${demographicInfo.age} <br>
    location: ${demographicInfo.location} <br>
    bbtype: ${demographicInfo.bbtype} <br>
    wfreq: ${demographicInfo.wfreq}`
    );
}

function hbarChart(selectedId) {
    let x_axis = selectedId.sample_values.slice(0, 10).reverse();
    let y_axis = selectedId.otu_ids
        .slice(0, 10)
        .reverse()
        .map((item) => `OTU ${item}`);
    let text = selectedId.otu_labels.slice(0, 10).reverse();

    barChart = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
    };

    let chart = [barChart];

    let layout = {
        margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 100,
        },
        height: 400,
        width: 600,
    };

    Plotly.newPlot("bar", chart, layout); // Plot bar chart
}

function bubbleChart(selectedId) {
    let x_axis = selectedId.otu_ids;  //Use otu_ids for the x values
    let y_axis = selectedId.sample_values;
    let marker_size = selectedId.sample_values;
    let color = selectedId.otu_ids;
    let text = selectedId.otu_labels;  // Using otu_labels for text

    bubble = {
        x: x_axis,
        y: y_axis,
        text: text,
        mode: "markers",
        scales: {
              yAxes: [{
                  display: true,
                  ticks: {
                      suggestedMax: 200,    // minimum will be 0, unless there is a lower value.
                     
                  }
              }]
        },
        marker: {
            color: color,
            colorscale: [
              ['0.0', 'rgb(165,0,38)'],  // Making a color scale for the bubbles
              ['0.111111111111', 'rgb(215,48,39)'],
              ['0.222222222222', 'rgb(244,109,67)'],
              ['0.333333333333', 'rgb(253,174,97)'],
              ['0.444444444444', 'rgb(254,224,144)'],
              ['0.555555555556', 'rgb(224,243,248)'],
              ['0.666666666667', 'rgb(171,217,233)'],
              ['0.777777777778', 'rgb(116,173,209)'],
              ['0.888888888889', 'rgb(69,117,180)'],
              ['1.0', 'rgb(49,54,149)']
            ],
            size: marker_size,
            showscale : true
        },
        type: "scatter", // type of plot
    };
    let chart = [bubble];
    
    
    let layout = {
        xaxis: {title: {text: "OTU ID"}, // Label the x axis OTU ID
      },
    };
    Plotly.newPlot("bubble", chart, layout); //Plot bubble
}