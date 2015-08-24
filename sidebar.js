

Sidebar = function(containerDiv, fileList)
{
    var menuBar = $('<div class="sidebar-menubar">').appendTo(containerDiv);
    var sidebarBody = $('<div class="sidebar">').appendTo(containerDiv);

    this.fileList = fileList;
    this.containerDiv = containerDiv;
    this.sidebarBody = sidebarBody;

    this.sidebarBody.attr("tabIndex", "0");

    var thisSidebar = this;
    this.sidebarBody.keydown( function(evt)
    {
        ({
            38: Sidebar.prototype.keyboardUpArrow,
            40: Sidebar.prototype.keyboardDownArrow,
            37: Sidebar.prototype.keyboardLeftArrow,
            39: Sidebar.prototype.keyboardRightArrow,
        }[evt.keyCode] || function(){} ).call(thisSidebar);
    });

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
    var labelDiv = $('<div class="sidebar-label sidebar-selectable">');
    var arrow = $('<span class="sidebar-arrow">');
    var path = Sidebar.join(parent_path, record.name);

    blockDiv.append( labelDiv );
    labelDiv.append( arrow );
    labelDiv.append( $('<span>').html(record.name) );
    labelDiv.on( 'click', this.makeSelectFunction( labelDiv, path ) );

    if( record.type == 'directory' )
    {
        arrow.empty().append( dgn.getIconSvg("right") );
        arrow.addClass('sidebar-expandable');
        var expandFunction = this.makeExpandFunction(blockDiv, path );
        labelDiv.data("expandFunction", expandFunction);
        arrow.on( 'click', expandFunction );
    }
    else
    {
        labelDiv.data("expandFunction", function(){} );
    }

    labelDiv.data("path", path);

    return blockDiv;
}

Sidebar.prototype.makeExpandFunction = function(block, path)
{
    var thisSidebar = this;
    return function(evt)
    {
        var listDiv = block.find( "> div.sidebar-list" );
        var arrow = block.find( "> div.sidebar-label > span.sidebar-arrow" );

        if( listDiv.length )
        {
            listDiv.remove();
            arrow.empty().append( dgn.getIconSvg("right") );
        }
        else
        {
            arrow.empty().append( dgn.getIconSvg("down") );

            listDiv = $('<div class="sidebar-list">');
            block.append(listDiv);

            listDiv.empty();
            var pathls = thisSidebar.fileList.ls(path);
            for( var i = 0; i < pathls.length; i++ )
            {
                listDiv.append(
                    thisSidebar.makeDivForRecord( pathls[i], path ));
            }
        }
    };
}

Sidebar.prototype.select = function(newdiv, path)
{
    if ( this.selectedDiv )
            this.selectedDiv.removeClass("sidebar-selected");

    this.selectedDiv = newdiv;
    this.selectedDiv.addClass("sidebar-selected");
}

Sidebar.prototype.makeSelectFunction = function(newdiv, path)
{
    var thisSidebar = this;
    return function(evt)
    {
        thisSidebar.select(newdiv, path);
    };
}

Sidebar.prototype.keyboardUpArrow = function()
{
    var selectables = $("div.sidebar-selectable");
    var index = selectables.index(this.selectedDiv);
    if( index > 0 )
    {
        index--;
        this.select( selectables.eq(index), "empty/some/path" );
    }
}

Sidebar.prototype.keyboardDownArrow = function()
{
    var selectables = $("div.sidebar-selectable");
    var index = selectables.index(this.selectedDiv);
    if( index < selectables.length - 1 )
    {
        index++;
        this.select( selectables.eq(index), "empty/some/path" );
    }
}

Sidebar.prototype.keyboardRightArrow = function()
{
    if( this.selectedDiv )
    {
        this.selectedDiv.data('expandFunction')();
    }
}

Sidebar.prototype.keyboardLeftArrow = function()
{
    if( this.selectedDiv )
    {
        this.selectedDiv.data('expandFunction')();
    }
}

