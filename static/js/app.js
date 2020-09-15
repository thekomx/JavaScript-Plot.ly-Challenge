var dataNames;
var dataSamples;
var dataMetadata;

function init() {
    d3.json('./static/data/samples.json').then(sampleData => {
        dataNames = sampleData.names;
        dataSamples = sampleData.samples;
        dataMetadata = sampleData.metadata;

        const select_name = d3.select('#selDataset');
        dataNames.forEach(nameData => {
            let opt_name = select_name.append('option');
            opt_name.attr('value', nameData);
            opt_name.text(nameData);
        })

        optionChanged(select_name.node().value);
    })
}

function demographic(svalue){
    const filtered_metadata = dataMetadata.filter(mdata=>mdata.id==svalue)[0];
    const div_deminfo = d3.select('.panel-body');
    div_deminfo.selectAll('p').remove();
    Object.entries(filtered_metadata).forEach(([key,value])=>{
        let p_diminfo = div_deminfo.append('p');
        p_diminfo.text(`${key} : ${value}`)
    })
}

function barchart(svalue){
    const filtered_sample = dataSamples.filter(sdata=>sdata.id==svalue)[0];
    let data = [{
        x : filtered_sample.sample_values.slice(0, 10),
        y : filtered_sample.otu_ids.slice(0,10).map(item=>'OTU'.concat(' ', item.toString())),
        text : filtered_sample.otu_labels,
        type : 'bar',
        orientation : 'h'
    }]
    Plotly.newPlot('bar', data)
}

function bubblechart(svalue){
    const filtered_sample = dataSamples.filter(sdata=>sdata.id==svalue)[0];
    let data = [{
        x : filtered_sample.otu_ids,
        y : filtered_sample.sample_values,
        text : filtered_sample.otu_labels,
        mode : 'markers',
        marker : {
            size : filtered_sample.sample_values,
            color : filtered_sample.otu_ids
        }
    }]
    Plotly.newPlot('bubble', data)
}

function gaugechart(svalue){
    const filtered_metadata = dataMetadata.filter(mdata=>mdata.id==svalue)[0];

    let level = (filtered_metadata.wfreq == null)? 0 : (filtered_metadata.wfreq * 20);
    let degrees = 180-level;
    let radius = .5;
    let radians = degrees * Math.PI / 180;
    let X = radius * Math.cos(radians);
    let Y = radius * Math.sin(radians);
    let M = (degrees < 45 || degrees > 135)? '-0.0 -0.025 L 0.0 0.025' : '-0.025 -0.0 L 0.025 0.0';
    let path = `M ${M} L ${X} ${Y} Z`;

    let trace_scatter = {
        type : 'scatter',
        x : [0],
        y : [0],
        marker : {size: 13, color:'850000'},
        showlegend : false
    }

    let trace_pie = {
        type: "pie",
        values : [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        text : ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        rotation : 90,
        textinfo : "text",
        textposition : "inside",
        hole : .5,
        hoverinfo : "none",
        showlegend : false,
        marker : {colors: ["#34A567", "#4BAF66", "#61BA6A", "#7EC478", "#A0CF90", "#BDD9A7", "#D5E3BE", "#E8EDD5", "#F7F7ED", "#FFFFFF"]}
    }

    let data = [trace_scatter, trace_pie];

    let layout = {
        title : {text : 'Scrub per Week', font: { size: 30 }},
        height : 500,
        width : 500,
        shapes : [{
            type : 'path',
            path : path,
            fillcolor : '850000',
            line : {color : '850000'}
        }],
        xaxis : {
            zeroline : false,
            showticklabels : false,
            showgrid : false,
            range : [-1, 1]},
        yaxis : {
            zeroline : false,
            showticklabels : false,
            showgrid : false,
            range : [-1, 1]}
    }

    Plotly.newPlot('gauge', data, layout)
}

function optionChanged(svalue){
    barchart(svalue);
    demographic(svalue);
    bubblechart(svalue);
    gaugechart(svalue);
}


init();