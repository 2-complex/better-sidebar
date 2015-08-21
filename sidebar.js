

Sidebar = function(containerDiv, fileList)
{
    var menuBar = $('<div style="display: inline-block; position: absolute; left:0px; right:0px; top:0px; height: 2em; line-height: 2em; background-color: #333; color:white;">').appendTo(containerDiv);
    var sidebarBody = $('<div style="display: inline-block; color:#eee; position: absolute; left:0px; width:400px; top:2em; bottom: 0px; background-color: black;">').appendTo(containerDiv);

    this.fileList = fileList;
    this.containerDiv = containerDiv;
    this.sidebarBody = sidebarBody;

    var rootls = this.fileList.ls('');
    for( var i = 0; i < rootls.length; i++ )
    {
        sidebarBody.append(this.makeDivForRecord(rootls[i]));
    }
}

Sidebar.prototype.makeDivForRecord = function(record)
{
    var topDiv = $('<div>');
    topDiv.on('click', this.makeExpandFunction(topDiv, record.name) );

    var itemDiv = $('<div>').html('+ ' + record.name);
    var listDiv = $('<div class="sidebar-list-div">').html();

    topDiv.append(itemDiv);
    topDiv.append(listDiv);

    return topDiv;
}

Sidebar.prototype.makeExpandFunction = function(newdiv, path)
{
    var thisSidebar = this;
    return function(evt)
    {
        var pathls = thisSidebar.fileList.ls(path);
        for( var i = 0; i < pathls.length; i++ )
        {
            newdiv
            .append( thisSidebar.makeDivForRecord(pathls[i]) );
        }
    };
}

