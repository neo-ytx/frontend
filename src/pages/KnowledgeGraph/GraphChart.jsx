import React, {Component} from 'react';
import * as d3 from "d3";
import $ from 'jquery';
import _ from 'underscore';

const jsondata={"node":[{"filter":[],"showstyle":"0","entitytype":"0","name":"组织机构","uuid":"18147380"},{"filter":[],"showstyle":"0","entitytype":"0","name":"公安厅","uuid":"18147392"},{"filter":[],"showstyle":"0","entitytype":"0","name":"旅游局","uuid":"18147393"},{"filter":[],"showstyle":"0","entitytype":"0","name":"气象局","uuid":"18147394"},{"filter":[],"showstyle":"0","entitytype":"0","name":"交通运输厅","uuid":"18147395"},{"filter":[],"showstyle":"0","entitytype":"0","name":"厅处室","uuid":"18147401"},{"filter":[],"showstyle":"0","entitytype":"1","name":"办公室","uuid":"18147424"},{"filter":[],"showstyle":"0","entitytype":"1","name":"法规处","uuid":"18147425"},{"filter":[],"showstyle":"0","entitytype":"1","name":"规划处","uuid":"18147426"},{"filter":[],"showstyle":"0","entitytype":"1","name":"财务处","uuid":"18147427"},{"filter":[],"showstyle":"0","entitytype":"1","name":"建管处","uuid":"18147428"},{"filter":[],"showstyle":"0","entitytype":"1","name":"安全处","uuid":"18147429"},{"filter":[],"showstyle":"0","entitytype":"1","name":"科教处","uuid":"18147430"},{"filter":[],"showstyle":"0","entitytype":"1","name":"审计处","uuid":"18147431"},{"filter":[],"showstyle":"0","entitytype":"1","name":"人事处","uuid":"18147432"},{"filter":[],"showstyle":"0","entitytype":"1","name":"机关党委","uuid":"18147433"},{"filter":[],"showstyle":"0","entitytype":"1","name":"离退休干部处","uuid":"18147434"},{"filter":[],"showstyle":"0","entitytype":"1","name":"综合处","uuid":"18147435"},{"filter":[],"showstyle":"0","entitytype":"0","name":"驻厅纪检组","uuid":"18147402"},{"filter":[],"showstyle":"0","entitytype":"0","name":"二级局","uuid":"18147403"},{"filter":[],"showstyle":"0","entitytype":"0","name":"高速公路基础数据","uuid":"18147378"},{"filter":[],"showstyle":"0","entitytype":"0","name":"公路局","uuid":"18147406"},{"filter":[],"showstyle":"0","entitytype":"0","name":"道路运输局","uuid":"18147407"},{"filter":[],"showstyle":"0","entitytype":"0","name":"海事航务局","uuid":"18147408"},{"filter":[],"showstyle":"0","entitytype":"0","name":"高管局","uuid":"18147409"},{"filter":[],"showstyle":"0","entitytype":"0","name":"交通建设工程质量监督局","uuid":"18147410"},{"filter":[],"showstyle":"0","entitytype":"0","name":"直属单位","uuid":"18147404"},{"filter":[],"showstyle":"0","entitytype":"1","name":"交通职业技术学院","uuid":"18147419"},{"filter":[],"showstyle":"0","entitytype":"1","name":"交通建设工程造价管理站","uuid":"18147420"},{"filter":[],"showstyle":"0","entitytype":"1","name":"公路运输海员工会","uuid":"18147421"},{"filter":[],"showstyle":"0","entitytype":"1","name":"贵州交通信息与应急指挥中心贵州省路网中心","uuid":"18147422"},{"filter":[],"showstyle":"0","entitytype":"1","name":"交通宣传教育中心","uuid":"18147423"},{"filter":[],"showstyle":"0","entitytype":"0","name":"地州市交通局","uuid":"18147405"},{"filter":[],"showstyle":"0","entitytype":"1","name":"贵阳市交通委员会","uuid":"18147411"},{"filter":[],"showstyle":"0","entitytype":"1","name":"遵义市交通运输局","uuid":"18147412"},{"filter":[],"showstyle":"0","entitytype":"1","name":"安顺市交通运输局","uuid":"18147413"},{"filter":[],"showstyle":"0","entitytype":"1","name":"黔南州交通运输局","uuid":"18147414"},{"filter":[],"showstyle":"0","entitytype":"1","name":"黔东南州交通运输局","uuid":"18147415"},{"filter":[],"showstyle":"0","entitytype":"1","name":"毕节地区交通运输局","uuid":"18147416"},{"filter":[],"showstyle":"0","entitytype":"1","name":"六盘水市交通运输局","uuid":"18147417"},{"filter":[],"showstyle":"0","entitytype":"1","name":"黔西南州交通运输局\n","uuid":"18147418"}],"relationship":[{"sourceid":"18147380","targetid":"18147392","name":"下位","uuid":"48723709"},{"sourceid":"18147380","targetid":"18147393","name":"下位","uuid":"48723710"}]} ;

export default class GraphChart extends Component {
    constructor(props){
        super(props)
        this.state = {
            svg:null,
	        timer:null,
	        editor:null,
	        simulation:null,
	        linkGroup:null,
	        linktextGroup:null,
	        nodeGroup:null,
	        nodetextGroup:null,
	        nodesymbolGroup:null,
	        nodebuttonGroup:null,
	        nodebuttonAction:'',
	        txx:{},
	        tyy:{},
	       	colorList: ["#ff8373", "#f9c62c", "#a5ca34", "#6fce7a", "#70d3bd", "#ea91b0"],
	        color5: '#ff4500',
	        predefineColors: ['#ff4500', '#ff8c00', '#90ee90', '#00ced1', '#1e90ff', '#c71585'],
	        defaultcr: 30,
	        selectnodeid: 0,
	        selectnodename: '',
	        selectsourcenodeid: 0,
	        selecttargetnodeid: 0,
	        graph: {
	            nodes: jsondata.node,
	            links: jsondata.relationship
	        },
	        graphEntity: {
	            uuid: 0,
	            name: '',
	            color: 'ff4500',
	            r: 30,
	            x: "",
	            y: ""
	        },
        }
    }

    componentDidMount(){
        this.initgraph();
    }
    
    render(){
        return(
            <div  id="app" className="mind-con">
                <div id="graphcontainer"  className="graphcontainer" />
                <div className="svg-set-box" />
            </div>
        )
    }



    btndeletelink() {
        this.isdeletelink = true;
        d3.select('.link').attr("class", "link linkdelete"); // 修改鼠标样式为"+"
    }
    
    getmorenode() {
        const self = this;
        const data = {domain: self.domain, nodeid: self.state.selectnodeid};
        $.ajax({
            data,
            type: "POST",
            url: "getmorerelationnode",
            success (result) {
                if (result.code === 200) {
                    const newnodes = result.data.node;
                    const newships = result.data.relationship;
                    const oldnodescount = self.graph.nodes.length;
                    newnodes.forEach((m)=>{
                        const sobj = self.state.graph.nodes.find( (x)=>{
                            return x.uuid === m.uuid
                        })
                        if (typeof(sobj) === "undefined") {
                            self.graph.nodes.push(m);
                        }
                    })
                    const newnodescount = self.graph.nodes.length;
                    if (newnodescount <= oldnodescount) {
                        self.$message({
                            message: '没有更多节点信息',
                            type: 'success'
                        });
                        return;
                    }
                    newships.forEach((m)=>{
                        const sobj = self.graph.links.find((x)=>{
                            return x.uuid === m.uuid
                        })
                        if (typeof(sobj) === "undefined") {
                            self.graph.links.push(m);
                        }
                    })
                    self.updategraph(self.state);
                }
            },
            error () {
            }
        });
    }

    initgraph(){
        let {
            svg,
            graph,
            linkGroup,
            linktextGroup,
            nodebuttonGroup,
            nodeGroup,
            nodetextGroup,
            nodesymbolGroup,
            simulation,
        } = this.state;
        let graphcontainer = d3.select(".graphcontainer");
        let width = graphcontainer._groups[0][0].offsetWidth;
        let height = window.screen.height - 154;//
        svg = graphcontainer.append("svg");
        svg.attr("width", width);
        svg.attr("height", height);
        svg.on('click',function(){
            d3.selectAll("use").classed("circle_opreate", true);
        }, 'false');
        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(function(d){
            return Math.floor(Math.random() * (700 - 200)) + 200;
                }).id(function (d) {
                return d.uuid
            }))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("collide", d3.forceCollide().strength(-30))
            .force("center", d3.forceCenter(width / 2, (height - 200) / 2));

        this.addmaker(svg);
        this.addnodebutton(svg);

        linkGroup = svg.append("g").attr("class", "line");
        linktextGroup = svg.append("g").attr("class", "line");
        nodeGroup = svg.append("g").attr("class", "node");
        nodetextGroup = svg.append("g").attr("class", "nodetext");
        nodesymbolGroup = svg.append("g").attr("class", "nodesymbol");
        nodebuttonGroup = svg.append("g").attr("class", "nodebutton");

        let state = {
            svg,
            graph,
            linkGroup,
            linktextGroup,
            nodebuttonGroup,
            nodeGroup,
            nodetextGroup,
            nodesymbolGroup,
            simulation,
        }
        this.updategraph(state)
    }
    
    updategraph(state) {
        const {
            svg,
            graph,
            linkGroup,
            linktextGroup,
            nodebuttonGroup,
            nodeGroup,
            nodetextGroup,
            nodesymbolGroup,
            simulation,
        } = state;
        let self = this;
        let lks = graph.links;
        let nodes = graph.nodes;
        let links = [];
        lks.forEach(function (m) {
            let sourceNode = nodes.filter(function (n) {
                return n.uuid === m.sourceid;
            })[0];
            if (typeof(sourceNode) == 'undefined') return;
            let targetNode = nodes.filter(function (n) {
                return n.uuid === m.targetid;
            })[0];
            if (typeof(targetNode) == 'undefined') return;
            links.push({source: sourceNode.uuid, target: targetNode.uuid, lk: m});
        });
       if(links.length>0){
           _.each(links, function(link) {
               let same = _.where(links, {
                   'source': link.source,
                   'target': link.target
               });
               let sameAlt = _.where(links, {
                   'source': link.target,
                   'target': link.source
               });
               let sameAll = same.concat(sameAlt);
               _.each(sameAll, function(s, i) {
                   s.sameIndex = (i + 1);
                   s.sameTotal = sameAll.length;
                   s.sameTotalHalf = (s.sameTotal / 2);
                   s.sameUneven = ((s.sameTotal % 2) !== 0);
                   s.sameMiddleLink = ((s.sameUneven === true) &&(Math.ceil(s.sameTotalHalf) === s.sameIndex));
                   s.sameLowerHalf = (s.sameIndex <= s.sameTotalHalf);
                   s.sameArcDirection = 1;
                   //s.sameArcDirection = s.sameLowerHalf ? 0 : 1;
                   s.sameIndexCorrected = s.sameLowerHalf ? s.sameIndex : (s.sameIndex - Math.ceil(s.sameTotalHalf));
               });
           });
           let maxSame = _.chain(links)
               .sortBy(function(x) {
                   return x.sameTotal;
               })
               .last()
               .value().sameTotal;

           _.each(links, function(link) {
               link.maxSameHalf = Math.round(maxSame / 2);
           });
       }
        // 更新连线 links
        let link = linkGroup.selectAll(".line >path").data(links, function (d) {
            return d.uuid;
        });
        link.exit().remove();
        let linkEnter = self.drawlink(link);
        link = linkEnter.merge(link);
        // 更新连线文字
        let linktext = linktextGroup.selectAll("text").data(links, function (d) {
            return d.uuid;
        });
        linktext.exit().remove();
        let linktextEnter = self.drawlinktext(linktext);
        linktext = linktextEnter.merge(linktext).text(function (d) {
            return d.lk.name;
        });
        // 更新节点按钮组
        d3.selectAll(".nodebutton  >g").remove();
        let nodebutton = nodebuttonGroup.selectAll(".nodebutton").data(nodes, function (d) {
            return d
        });
        nodebutton.exit().remove();
        let nodebuttonEnter = self.drawnodebutton(nodebutton);
        nodebutton = nodebuttonEnter.merge(nodebutton);
        // 更新节点
        let node = nodeGroup.selectAll("circle").data(nodes, function (d) {
            return d
        });
        node.exit().remove();
        let nodeEnter = self.drawnode(node);
        node = nodeEnter.merge(node).text(function (d) {
            return d.name;
        });
        // 更新节点文字
        let nodetext = nodetextGroup.selectAll("text").data(nodes, function (d) {
            return d.uuid
        });
        nodetext.exit().remove();
        let nodetextEnter = self.drawnodetext(nodetext);
        nodetext = nodetextEnter.merge(nodetext).text(function (d) {
            return d.name;
        });
        nodetext.append("title")// 为每个节点设置title
            .text(function (d) {
                return d.name;
            });
        // 更新节点标识
        let nodesymbol = nodesymbolGroup.selectAll("path").data(nodes, function (d) {
            return d.uuid;
        });
        nodesymbol.exit().remove();
        let nodesymbolEnter = self.drawnodesymbol(nodesymbol);
        nodesymbol = nodesymbolEnter.merge(nodesymbol);
        nodesymbol.attr("fill", "#e15500");
        nodesymbol.attr("display", function (d) {
            if (typeof(d.hasfile) != "undefined" && d.hasfile > 0) {
                return "block";
            }
            return "none";
        })
        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alphaTarget(0).restart();
        function linkArc(d) {
            let dx = (d.target.x - d.source.x),
                dy = (d.target.y - d.source.y),
                dr = Math.sqrt(dx * dx + dy * dy),
                unevenCorrection = (d.sameUneven ? 0 : 0.5);
            let curvature = 2,
                arc = (1.0/curvature)*((dr * d.maxSameHalf) / (d.sameIndexCorrected - unevenCorrection));
            if (d.sameMiddleLink) {
                arc = 0;
            }
            let dd="M" + d.source.x + "," + d.source.y + "A" + arc + "," + arc + " 0 0," + d.sameArcDirection + " " + d.target.x + "," + d.target.y;
            return dd;
        }

        function ticked() {
            // 更新连线坐标
            /*link.attr("x1", function (d) {
                return d.source.x;
               })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });*/
            link.attr("d", linkArc)
            // 刷新连接线上的文字位置
           /* linktext.attr("x", function (d) {
                return (d.source.x + d.target.x) / 2;
            })
                .attr("y", function (d) {
                    return (d.source.y + d.target.y) / 2;
                })*/


            // 更新节点坐标
            node.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
            // 更新节点操作按钮组坐标
            nodebutton.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
           nodebutton.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y+ ") scale(1)";
            })

            // 更新文字坐标
            nodetext.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                    return d.y;
                });
            // 更新回形针坐标
            nodesymbol.attr("transform", function (d) {
                return "translate(" + (d.x + 8) + "," + (d.y - 30) + ") scale(0.015,0.015)";
            })
        }
        // 鼠标滚轮缩放
        //self.svg.call(d3.zoom().transform, d3.zoomIdentity);//缩放至初始倍数
        svg.call(d3.zoom().on("zoom", function () {
            d3.selectAll('.node').attr("transform",d3.event.transform);
            d3.selectAll('.nodetext').attr("transform",d3.event.transform);
            d3.selectAll('.line').attr("transform",d3.event.transform);
            d3.selectAll('.linetext').attr("transform",d3.event.transform);
            d3.selectAll('.nodesymbol').attr("transform",d3.event.transform);
            d3.selectAll('.nodebutton').attr("transform",d3.event.transform);
            //self.svg.selectAll("g").attr("transform", d3.event.transform);
        }));
        svg.on("dblclick.zoom", null); // 静止双击缩放
        //按钮组事件
        svg.selectAll(".buttongroup").on("click", function (d,i) {
            console.log(self.state.nodebuttonAction);
            console.log(d);
            if (self.state.nodebuttonAction) {
                switch (self.state.nodebuttonAction) {
                    case "EDIT":
                        self.setState({
                            isedit: true,
                            propactiveName: 'propedit',
                            txx: d.x,
                            tyy: d.y
                        })
                        break;
                    case "MORE":
                        self.getmorenode();
                        break;
                    case "CHILD":
                        self.setState({
                            operatetype: 2,
                            isbatchcreate: true,
                            isedit: false
                        })
                        break;
                    case "LINK":
                        self.setState({
                            isaddlink: true,
                            selectsourcenodeid: d.uuid
                        })
                        break;
                    case "DELETE":
                        let out_buttongroup_id='.out_buttongroup_'+i;
                        self.deletenode(out_buttongroup_id, d.uuid);
                        break;
                }
                ACTION = '';//重置 ACTION
            }

        });
        //按钮组事件绑定
        svg.selectAll(".action_0").on("click", function (d) {
            self.setState({
                nodebuttonAction: 'EDIT'
            })
        });
        svg.selectAll(".action_1").on("click", function (d) {
            self.setState({
                nodebuttonAction: 'MORE'
            })
        });
        svg.selectAll(".action_2").on("click", function (d) {
            self.setState({
                nodebuttonAction: 'CHILD'
            })
        });
        svg.selectAll(".action_3").on("click", function (d) {
            self.setState({
                nodebuttonAction: 'LINK'
            })
        });
        svg.selectAll(".action_4").on("click", function (d) {
            self.setState({
                nodebuttonAction: 'DELETE'
            })
        });
        this.setState({
            svg: svg,
            linkGroup: linkGroup,
            linktextGroup: linktextGroup,
            nodebuttonGroup: nodebuttonGroup,
            nodeGroup: nodeGroup,
            nodetextGroup: nodetextGroup,
            nodesymbolGroup: nodesymbolGroup,
            simulation: simulation,
        })
    }

    createnode() {
        const self = this;
        const data = self.state.graphEntity;
        data.domain = self.domain;
        $.ajax({
            data,
            type: "POST",
            traditional: true,
            url: "createnode",
            success (result) {
                if (result.code === 200) {
                    d3.select('.graphcontainer').style("cursor", "");
                    if (self.graphEntity.uuid !== 0) {
                        for (let i = 0; i < self.graph.nodes.length; i+=1) {
                            if (self.graph.nodes[i].uuid === self.graphEntity.uuid) {
                                self.graph.nodes.splice(i, 1);
                            }
                        }
                    }
                    const newnode = result.data;
                    newnode.x = self.txx;
                    newnode.y = self.tyy;
                    newnode.fx = self.txx;
                    newnode.fy = self.tyy;
                    self.state.graph.nodes.push(newnode);
                    self.resetentity();
                    self.updategraph(self.state);
                    self.isedit = false;
                    self.resetsubmit();
                }
            }
        });
    }

    addmaker(SVG) {
        let arrowMarker = SVG.append("marker")
            .attr("id", "arrow")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "20")//
            .attr("markerHeight", "20")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", "22")// 13
            .attr("refY", "0")
            .attr("orient", "auto");
        let arrow_path = "M0,-5L10,0L0,5";// 定义箭头形状
        arrowMarker.append("path").attr("d", arrow_path).attr("fill", "#fce6d4");
    }

    addnodebutton(SVG) {
        let self = this;
        let nodebutton = SVG.append("defs").append("g")
            .attr("id", "out_circle")
        let database = [1,1,1,1,1];
        let pie = d3.pie();
        let piedata = pie(database);
        let buttonEnter=nodebutton.selectAll(".buttongroup")
            .data(piedata)
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return "action_" + i ;
            });
        let arc = d3.arc()
            .innerRadius(30)
            .outerRadius(60);
        buttonEnter.append("path")
            .attr("d", function (d) {
                return arc(d)
            })
            .attr("fill", "#D2D5DA")
            .style("opacity", 0.6)
            .attr("stroke", "#f0f0f4")
            .attr("stroke-width", 2);
        buttonEnter.append("text")
            .attr("transform", function (d, i) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                let zi = new Array()
                zi[0] = "编辑";
                zi[1] = "展开";
                zi[2] = "追加";
                zi[3] = "连线";
                zi[4] = "删除";
                return zi[i]
            })
            .attr("font-size", 10);
    }

    dragstarted(d) {
        if (!d3.event.active) {
            let simulation = simulation.alphaTarget(0.3).restart();
            this.setState({
                simulation: simulation
            })
        }
        d.fx = d.x;
        d.fy = d.y;
        d.fixed = true;
    }

    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    dragended(d) {
        if (!d3.event.active){
            let simulation = simulation.alphaTarget(0);
            this.setState({
                simulation: simulation
            })
        }
    }

    drawnode(node) {
        let self = this;
        let nodeEnter = node.enter().append("circle");
        nodeEnter.attr("r", function (d) {
            if (typeof(d.r) != "undefined" && d.r != '') {
                return d.r
            }
            return 30;
        });
        nodeEnter.attr("fill", function (d) {
            if (typeof(d.color) != "undefined" && d.color != '') {
                return d.color
            }
            return "#ff4500";
        });
        nodeEnter.style("opacity", 0.8);
        nodeEnter.style("stroke", function (d) {
            if (typeof(d.color) != "undefined" && d.color != '') {
                return d.color
            }
            return "#ff4500";
        });
        nodeEnter.style("stroke-opacity", 0.6);
        nodeEnter.append("title")// 为每个节点设置title
            .text(function (d) {
                return d.name;
            })
        nodeEnter.on("mouseover", function (d, i) {
            self.setState({
                timer: setTimeout(function () {
                    d3.select('#richContainer')
                        .style('position', 'absolute')
                        .style('left', d.x + "px")
                        .style('top', d.y + "px")
                        .style('display', 'block');
                    self.editorcontent = "";
                    self.showImageList = [];
                    self.getNodeDetail(d.uuid);
                }, 3000)
            })
        });
        nodeEnter.on("mouseout", function (d, i) {
            clearTimeout( self.state.timer);
        });
        nodeEnter.on("dblclick", function (d) {
            app.updatenodename(d);// 双击更新节点名称
        });
        nodeEnter.on("mouseenter", function (d) {
            let aa = d3.select(this)._groups[0][0];
            if (aa.classList.contains("selected")) return;
            d3.select(this).style("stroke-width", "6");
        });
        nodeEnter.on("mouseleave", function (d) {
            let aa = d3.select(this)._groups[0][0];
            if (aa.classList.contains("selected")) return;
            d3.select(this).style("stroke-width", "2");
        });
        nodeEnter.on("click", function (d,i) {
            let{
                svg,
                graphEntity,
                selectnodeid,
                selectnodename,
                selecttargetnodeid,
                selectsourcenodeid,
            } = self.state;
            let out_buttongroup_id='.out_buttongroup_'+i;
            svg.selectAll("use").classed("circle_opreate", true);
            svg.selectAll(out_buttongroup_id).classed("circle_opreate", false);
            graphEntity = d;
            selectnodeid = d.uuid;
            selectnodename = d.name;

            self.setState({
                svg,
                graphEntity,
                selectnodeid,
                selectnodename,
            })
            // 更新工具栏节点信息
            self.getcurrentnodeinfo(d);

            // 添加连线状态
            if (self.state.isaddlink) {
                selecttargetnodeid = d.uuid;
                if (selectsourcenodeid == selecttargetnodeid || selectsourcenodeid == 0 || selecttargetnodeid == 0) return;
                self.createlink(selectsourcenodeid, selecttargetnodeid, "RE")
                self.setState({
                    selectsourcenodeid: 0,
                    selecttargetnodeid: 0
                })
                d.fixed = false
                d3.event.stopPropagation();
            }
        });
        nodeEnter.call(d3.drag()
            .on("start", self.dragstarted)
            .on("drag", self.dragged)
            .on("end", self.dragended));
        return nodeEnter;
    }

    drawnodetext(nodetext) {
        let self = this;
        let nodetextenter = nodetext.enter().append("text")
            .style("fill", "#fff")
            .attr("dy", 4)
            .attr("font-family", "微软雅黑")
            .attr("text-anchor", "middle")
            .text(function (d) {
                let length = d.name.length;
                if (d.name.length > 4) {
                    let s = d.name.slice(0, 4) + "...";
                    return s;
                }
                return d.name;
            });
        nodetextenter.on("mouseover", function (d, i) {
            self.setState({
                timer: setTimeout(function () {
                    d3.select('#richContainer')
                        .style('position', 'absolute')
                        .style('left', d.x + "px")
                        .style('top', d.y + "px")
                        .style('display', 'block');
                    self.editorcontent = "";
                    self.showImageList = [];
                    self.getNodeDetail(d.uuid);
                }, 3000)
            })
        });

        nodetextenter.on("dblclick", function (d) {
            app.updatenodename(d);// 双击更新节点名称
        });
        nodetextenter.on("click", function (d) {
            $('#link_menubar').hide();// 隐藏空白处右键菜单
            self.graphEntity = d;
            self.selectnodeid = d.uuid;
            // 更新工具栏节点信息
            self.getcurrentnodeinfo(d);
            // 添加连线状态
            if (self.isaddlink) {
                self.selecttargetnodeid = d.uuid;
                if (self.selectsourcenodeid == self.selecttargetnodeid || self.selectsourcenodeid == 0 || self.selecttargetnodeid == 0) return;
                self.createlink(self.selectsourcenodeid, self.selecttargetnodeid, "RE")
                self.selectsourcenodeid = 0;
                self.selecttargetnodeid = 0;
                d.fixed = false
                d3.event.stopPropagation();
            }
        });

        return nodetextenter;
    }

    drawnodesymbol(nodesymbol) {
        let self = this;
        let symnol_path = "M566.92736 550.580907c30.907733-34.655573 25.862827-82.445653 25.862827-104.239787 0-108.086613-87.620267-195.805867-195.577173-195.805867-49.015467 0-93.310293 18.752853-127.68256 48.564907l-0.518827-0.484693-4.980053 4.97664c-1.744213 1.64864-3.91168 2.942293-5.59104 4.72064l0.515413 0.484693-134.69696 133.727573L216.439467 534.8352l0 0 137.478827-136.31488c11.605333-10.410667 26.514773-17.298773 43.165013-17.298773 36.051627 0 65.184427 29.197653 65.184427 65.24928 0 14.032213-5.33504 26.125653-12.73856 36.829867l-131.754667 132.594347 0.515413 0.518827c-10.31168 11.578027-17.07008 26.381653-17.07008 43.066027 0 36.082347 29.16352 65.245867 65.184427 65.245867 16.684373 0 31.460693-6.724267 43.035307-17.07008l0.515413 0.512M1010.336427 343.49056c0-180.25472-145.882453-326.331733-325.911893-326.331733-80.704853 0-153.77408 30.22848-210.418347 79.0528l0.484693 0.64512c-12.352853 11.834027-20.241067 28.388693-20.241067 46.916267 0 36.051627 29.16352 65.245867 65.211733 65.245867 15.909547 0 29.876907-6.36928 41.192107-15.844693l0.38912 0.259413c33.624747-28.030293 76.301653-45.58848 123.511467-45.58848 107.99104 0 195.549867 87.6544 195.549867 195.744427 0 59.815253-27.357867 112.71168-69.51936 148.503893l0 0-319.25248 317.928107 0 0c-35.826347 42.2912-88.654507 69.710507-148.340053 69.710507-107.956907 0-195.549867-87.68512-195.549867-195.805867 0-59.753813 27.385173-112.646827 69.515947-148.43904l-92.18048-92.310187c-65.69984 59.559253-107.700907 144.913067-107.700907 240.749227 0 180.28544 145.885867 326.301013 325.915307 326.301013 95.218347 0 180.02944-41.642667 239.581867-106.827093l0.13312 0.129707 321.061547-319.962453-0.126293-0.13312C968.69376 523.615573 1010.336427 438.71232 1010.336427 343.49056L1010.336427 343.49056 1010.336427 343.49056zM1010.336427 343.49056";// 定义回形针形状
        let nodesymbolEnter = nodesymbol.enter().append("path").attr("d", symnol_path);
        nodesymbolEnter.call(d3.drag()
            .on("start", self.dragstarted)
            .on("drag", self.dragged)
            .on("end", self.dragended));
        return nodesymbolEnter;
    }

    drawnodebutton(nodebutton) {
        let self = this;
        let nodebuttonEnter = nodebutton.enter().append("g").append("use")//  为每个节点组添加一个 use 子元素
            .attr("r", function(d){
                return d.r;
            })
            .attr("xlink:href", "#out_circle") //  指定 use 引用的内容
            .attr('class',function(d,i){
                return 'buttongroup out_buttongroup_'+i;
            })
            .classed("circle_opreate", true);

        return nodebuttonEnter;
    }
    
    drawlink(link) {
        let self = this;
        let linkEnter = link.enter().append("path")
            .attr("stroke-width", 1)
            .attr("stroke", "#fce6d4")
            .attr("fill", "none")
            .attr("id", function (d) {
                return "invis_" + d.lk.sourceid + "-" + d.lk.name + "-" + d.lk.targetid;
            })
            .attr("marker-end", "url(#arrow)")
            ;// 箭头
        linkEnter.on("dblclick", function (d) {
            self.selectnodeid = d.lk.uuid;
            if (self.isdeletelink) {
                self.deletelink();
            } else {
                self.updatelinkName();
            }
        });
        linkEnter.on("contextmenu", function (d) {
            let cc = $(this).offset();
            app.selectnodeid = d.lk.uuid;
            app.selectlinkname = d.lk.name;
            d3.select('#link_menubar')
                .style('position', 'absolute')
                .style('left', cc.left + "px")
                .style('top', cc.top + "px")
                .style('display', 'block');
            d3.event.preventDefault();// 禁止系统默认右键
            d3.event.stopPropagation();// 禁止空白处右键
        });
        linkEnter.on("mouseenter", function (d) {
            d3.select(this).style("stroke-width", "6").attr("stroke", "#ff9e9e").attr("marker-end", "url(#arrow2)");
        });
        linkEnter.on("mouseleave", function (d) {
            d3.select(this).style("stroke-width", "1").attr("stroke", "#fce6d4").attr("marker-end", "url(#arrow)");
        });
        return linkEnter;
    }

    drawlinktext(link) {
        let linktextEnter = link.enter().append('text')
            .style('fill', '#e3af85')
            .append("textPath")
            .attr("startOffset", "50%")
            .attr("text-anchor", "middle")
            .attr("xlink:href", function(d) {
                return "#invis_" + d.lk.sourceid + "-" + d.lk.name + "-" + d.lk.targetid;
            })
            .style("font-size", 14)
            .text(function (d) {
                if (d.lk.name != '') {
                    return d.lk.name;
                }
            });

        linktextEnter.on("mouseover", function (d) {
            app.selectnodeid = d.lk.uuid;
            app.selectlinkname = d.lk.name;
            let cc = $(this).offset();
            d3.select('#link_menubar')
                .style('position', 'absolute')
                .style('left', cc.left + "px")
                .style('top', cc.top + "px")
                .style('display', 'block');
        });

        return linktextEnter;
    }

    deletenode(out_buttongroup_id, selectnodeid) {
        const self = this;
        self.$confirm('此操作将删除该节点及周边关系(不可恢复), 是否继续?', '三思而后行', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(function () {
            const data = {domain: self.state.domain, nodeid: selectnodeid};
            $.ajax({
                data,
                type: "POST",
                url: "deletenode",
                success(result) {
                    if (result.code === 200) {
                        let {
                            svg,
                            graph,
                            linkGroup,
                            linktextGroup,
                            nodebuttonGroup,
                            nodeGroup,
                            nodetextGroup,
                            nodesymbolGroup,
                            simulation,
                        } = self.state;
                        svg.selectAll(out_buttongroup_id).remove();
                        let rships = result.data;
                        // 删除节点对应的关系
                        for (let m = 0; m < rships.length; m++) {
                            for (let i = 0; i < graph.links.length; i++) {
                                if (graph.links[i].uuid == rships[m].uuid) {
                                    graph.links.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                        }
                        // 找到对应的节点索引
                        let j = -1;
                        for (let i = 0; i < graph.nodes.length; i++) {
                            if (graph.nodes[i].uuid == selectnodeid) {
                                j = i;
                                break;
                            }
                        }
                        if (j >= 0) {
                            let state = {
                                svg,
                                graph: graph.nodes.splice(j, 1), // 根据索引删除该节点
                                linkGroup,
                                linktextGroup,
                                nodebuttonGroup,
                                nodeGroup,
                                nodetextGroup,
                                nodesymbolGroup,
                                simulation,
                            }
                            self.setState({
                                selectnodeid: 0,
                            })
                            self.updategraph(state);
                            // self.resetentity();
                            // self.$message({
                            //     type: 'success',
                            //     message: '操作成功!'
                            // });
                        }

                    }
                }
            })
        }).catch(function () {
            self.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }

    deletelink() {
        const self = this;
        this.$confirm('此操作将删除该关系(不可恢复), 是否继续?', '三思而后行', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(function () {
            const data = {domain: self.domain, shipid: self.selectnodeid};
            $.ajax({
                data,
                type: "POST",
                url: "deletelink",
                success(result) {
                    if (result.code === 200) {
                        let j = -1;
                        for (let i = 0; i < self.graph.links.length; i+=1) {
                            if (self.graph.links[i].uuid === self.selectnodeid) {
                                j = i;
                                break;
                            }
                        }
                        if (j >= 0) {
                            self.selectnodeid = 0;
                            self.graph.links.splice(i, 1);
                            self.updategraph(self.state);
                            self.isdeletelink = false;
                        }
                    }
                }
            });
        }).catch(function () {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }

    createlink(sourceId, targetId, ship) {
        const self = this;
        const data = {domain: self.domain, sourceid: sourceId, targetid: targetId, ship: ''};
        $.ajax({
            data,
            type: "POST",
            url: "createlink",
            success(result) {
                if (result.code === 200) {
                    const newship = result.data;
                    const {
                        svg,
                        graph,
                        linkGroup,
                        linktextGroup,
                        nodebuttonGroup,
                        nodeGroup,
                        nodetextGroup,
                        nodesymbolGroup,
                        simulation,
                    } = self.state;
                    graph.links.push(newship);
                    const state ={
                        svg,
                        graph,
                        linkGroup,
                        linktextGroup,
                        nodebuttonGroup,
                        nodeGroup,
                        nodetextGroup,
                        nodesymbolGroup,
                        simulation,
                    }
                    self.setState({
                        isaddlink:false,
                    })
                    self.graph.links.push(newship);
                    self.updategraph(state);
                }
            }
        });
    }

    updatelinkName() {
        const self = this;
        self.$prompt('请输入关系名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: this.selectlinkname
        }).then(function (res) {
            const {value} = res;
            const data = {domain: self.domain, shipid: self.selectnodeid, shipname: value};
            $.ajax({
                data,
                type: "POST",
                url: "updatelink",
                success(result) {
                    if (result.code === 200) {
                        const newship = result.data;
                        self.graph.links.forEach(function (model) {
                            const m = model;
                            if (m.uuid === newship.uuid) {
                                m.name = newship.name;
                            }
                        });
                        self.selectnodeid = 0;
                        self.updategraph(self.state);
                        self.isaddlink = false;
                        self.selectlinkname = '';
                    }
                }
            });
        }).catch(function () {
            self.$message({
                type: 'info',
                message: '取消输入'
            });
        });
    }

    updatenodename(d) {
        const self = this;
        self.$prompt('编辑节点名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: d.name
        }).then(function (res) {
            const {value} = res;
            const data = {domain: self.domain, nodeid: d.uuid, nodename: value};
            $.ajax({
                data,
                type: "POST",
                url:  "updatenodename",
                success(result) {
                    if (result.code === 200) {
                        if (d.uuid !== 0) {
                            for (let i = 0; i < self.graph.nodes.length; i+=1) {
                                if (self.graph.nodes[i].uuid === d.uuid) {
                                    self.graph.nodes[i].name = value;
                                }
                            }
                        }
                        self.updategraph(self.state);
                        self.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    }
                }
            });
        }).catch(function () {
            self.$message({
                type: 'info',
                message: '取消操作'
            });
        });
    }

    getNodeDetail(nodeid) {
        const self = this;
        const data = {domainid: self.domainid, nodeid};
        $.ajax({
            data,
            type: "POST",
            url: "getnodedetail",
            success(result) {
                if (result.code === 200) {
                    self.setState({
                        editorcontent: result.data.content,
                        showImageList: result.data.imagelist
                    })
                }
            }
        })
    }

    // btnaddsingle(){
    //     d3.select('.graphcontainer').style("cursor", "crosshair");// 进入新增模式，鼠标变成＋
    // }
}
