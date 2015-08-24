
Sidebar = function(containerDiv, fileList)
{
    var menuBar = $('<div class="sidebar-menubar">').appendTo(containerDiv);
    var sidebarBody = $('<div class="sidebar">').appendTo(containerDiv);

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
    var blockDiv = $('<div class="sidebar-block">');
    var labelDiv = $('<div class="sidebar-label">').html('+ ' + record.name);
    var listDiv = $('<div class="sidebar-list">');

    labelDiv.on( 'click', this.makeExpandFunction(blockDiv, record.name) );

    blockDiv.append(labelDiv);
    blockDiv.append(listDiv);

    return blockDiv;
}

Sidebar.prototype.makeExpandFunction = function(newdiv, path)
{
    var thisSidebar = this;
    return function(evt)
    {
        var population = newdiv.find( "> div.sidebar-list >" ).length;
        var listDiv = newdiv.find( "> div.sidebar-list" );

        if ( population )
        {
            listDiv.empty();
        }
        else
        {
            var pathls = thisSidebar.fileList.ls(path);
            for( var i = 0; i < pathls.length; i++ )
            {
                listDiv.append(
                    thisSidebar.makeDivForRecord(pathls[i]) );
            }
        }
    };
}

