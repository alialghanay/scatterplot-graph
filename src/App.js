import React, { Component } from 'react';
import * as d3 from "d3";
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.myReference = React.createRef();
  }
  state = { 
    data: this.props.data
   }
  componentDidMount() {
    this.update();
  }

  update() {
    const dataset = this.state.data;
    const w = 900;
    const h = 500;
    const padding = 50;

    let tooltip = d3.select('#tooltip');

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d.Year) - 1, d3.max(dataset, (d) => d.Year) + 1])
                     .range([padding, w - padding]);
    const yScale = d3.scaleTime()
                     .domain([d3.max(dataset, (d) => new Date(d.Seconds * 1000)), d3.min(dataset, (d) => new Date(d.Seconds * 1000))])
                     .range([h - padding, padding]);
    const svg = d3.select(this.myReference.current)
    .append('svg')
    .attr('width', w)
    .attr('height', h);
    
    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('cx', (d) => {
         return xScale(d['Year']);
       }) 
       .attr('cy', (d, i) => {
         return yScale(new Date(d['Seconds'] * 1000));
       })
       .attr('r', 6)
       .attr("class", 'dot')
       .attr('data-xvalue', (d) => d.Year)
       .attr('data-yvalue', (d) => new Date(`February 23, ${d.Year} 00:${d.Time}`))
       .attr('fill', (d) => {
         if(d["Doping"] !== ""){
           return 'orange'
         }else return 'lightgreen';
       })
       .on('mouseover', (d, i) => {
        tooltip.transition()
               .style('visibility', 'visible')
               .style('left', d.pageX + 'px')
               .style('top', d.pageY - 50 + 'px');
        tooltip.html(
          i.Name +
            ': ' +
            i.Nationality +
            '<br/>' +
            'Year: ' +
            i.Year +
            ', Time: ' +
            i.Time +
            (i.Doping ? '<br/><br/>' + i.Doping : '')
        );

        document.querySelector('#tooltip').setAttribute('data-year', i['Year']);
      })
      .on('mouseout', () => {
        tooltip.transition()
               .style('visibility', 'hidden');
      });

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'));      
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));
    svg.append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis)
      .attr("id", "x-axis");

    svg.append('text')
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x",  w - padding)
      .attr("y", h - padding + 37)
      .text("Years");
    
    svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis)
      .attr("id", "y-axis");
    
    svg.append("text")
       .attr("class", "y label")
       .attr("text-anchor", "end")
       .attr("x",  0 - padding)
       .attr("y", padding - 37)
       .attr("transform", "rotate(-90)")
       .text("Time in Minutes");

  }
  render() { 
    return (
      <div className='container'>
        <div className='graph-container'>
          <h1 id='title'>Doping in Professional Bicycle Racing</h1>
          <div className='graph' ref={this.myReference}></div>
        </div>
        <div id='legend'>
          <div className='orange'>
            <div className='orange-box'></div>
            <text>Riders with doping allegations</text>
          </div>
          <div className='lightgreen'>
            <div className='lightgreen-box'></div>
            <text>No doping allegations</text>
          </div>
        </div>
        <div id='tooltip'></div>
      </div>
    );
  }
}