
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
        sidebarBody.append(this.makeDivForRecord(rootls[i], ""));
    }
}

Sidebar.escapeRegExp = function(string)
{
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

Sidebar.replaceAll = function(string, find, replace)
{
    return string.replace(new RegExp(Sidebar.escapeRegExp(find), 'g'), replace);
}

Sidebar.join = function(a, b)
{
    if ( a == "" )
        return b;
    return Sidebar.replaceAll(a.split('/').concat(b.split('/')).join('/'), '//', '/')
}

Sidebar.prototype.makeDivForRecord = function(record, parent_path)
{
    var blockDiv = $('<div class="sidebar-block">');
    var labelDiv = $('<div class="sidebar-label">');
    var arrow = $('<span class="sidebar-arrow">');

    blockDiv.append( labelDiv );
    labelDiv.append( arrow );
    labelDiv.append( $('<span>').html(record.name) );

    if( record.type == 'directory' )
    {
        arrow.html('+ ');
        arrow.addClass('sidebar-expandable');
        blockDiv.append($('<div class="sidebar-list" style="display:none;">'));
        arrow.on( 'click', this.makeExpandFunction(blockDiv,
            Sidebar.join(parent_path, record.name) ) );
    }

    return blockDiv;
}

Sidebar.prototype.makeExpandFunction = function(newdiv, path)
{
    var thisSidebar = this;
    return function(evt)
    {
        var listDiv = newdiv.find( "> div.sidebar-list" );
        var arrow = newdiv.find( "> div.sidebar-label > span.sidebar-arrow" );

        if( listDiv.css('display') == "none" )
        {
            arrow.html("- ");
            listDiv.css('display', "inline-block");
            listDiv.empty();
            var pathls = thisSidebar.fileList.ls(path);
            for( var i = 0; i < pathls.length; i++ )
            {
                listDiv.append(
                    thisSidebar.makeDivForRecord( pathls[i], path ));
            }
        }
        else
        {
            arrow.html("+ ");
            listDiv.css('display', "none");
        }
    };
}

