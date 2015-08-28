

FileSystemView = function(containerDiv, fileList)
{
    var menuBar = $('<div class="sidebar-menubar">').appendTo(containerDiv);
    var sidebarContainer = $('<div class="sidebar-container">').appendTo(containerDiv);
    var resizer = $('<div class="sidebar-resizer">').appendTo(sidebarContainer);
    var sidebarBody = $('<div class="sidebar-body">').appendTo(sidebarContainer);

    this.fileList = fileList;
    this.containerDiv = containerDiv;
    this.sidebarBody = sidebarBody;

    resizer.draggable({ axis: "x", scroll: false });
    resizer.on( "drag", function( event, ui )
    {
        sidebarContainer.css({width: ui.position.left + resizer.width()});
    } );

    this.sidebarBody.attr("tabIndex", "0");

    var thisFileSystemView = this;
    this.sidebarBody.keydown( function(evt)
    {
        ({
            38: FileSystemView.prototype.keyboardUpArrow,
            40: FileSystemView.prototype.keyboardDownArrow,
            37: FileSystemView.prototype.keyboardLeftArrow,
            39: FileSystemView.prototype.keyboardRightArrow,
        }[evt.keyCode] || function(){} ).call(thisFileSystemView);
    });

    var rootls = this.fileList.ls('');
    for( var i = 0; i < rootls.length; i++ )
    {
        this.sidebarBody.append(this.makeDivForRecord(rootls[i], ""));
    }
}

FileSystemView.escapeRegExp = function(string)
{
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

FileSystemView.replaceAll = function(string, find, replace)
{
    return string.replace(new RegExp(FileSystemView.escapeRegExp(find), 'g'), replace);
}

FileSystemView.join = function(a, b)
{
    if ( a == "" )
        return b;
    return FileSystemView.replaceAll(a.split('/').concat(b.split('/')).join('/'), '//', '/')
}

FileSystemView.prototype.makeDivForRecord = function(record, parent_path)
{
    var blockDiv = $('<div class="sidebar-block">');
    var labelDiv = $('<div class="sidebar-label sidebar-selectable">');
    var arrow = $('<span class="sidebar-arrow">');
    var path = FileSystemView.join(parent_path, record.name);

    blockDiv.append( labelDiv );
    labelDiv.append( arrow );

    var icon = dgn.getIconSvg({
            "file":"file",
            "directory":"folder",
            "drive":"drive"
        }[record.type] || "file", "icon type-icon");

    labelDiv.append( icon, $('<span class="sidebar-name-text">').html(record.name) );

    labelDiv.on( 'click', this.makeSelectFunction( labelDiv, path ) );

    if( record.type == 'directory' ||
        record.type == 'drive' )
    {
        arrow.empty().append( dgn.getIconSvg( "right" ) );
        arrow.addClass('sidebar-expandable');
        var expandFunction = this.makeExpandFunction( blockDiv );
        labelDiv.data("expandFunction", expandFunction);
        arrow.on( 'click', expandFunction );
    }
    else
    {
        labelDiv.data("expandFunction", function(){} );
    }

    blockDiv.data("path", path);

    return blockDiv;
}

FileSystemView.prototype.makeExpandFunction = function(block)
{
    var thisFileSystemView = this;
    return function(evt)
    {
        var path = block.data("path");
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
            var pathls = thisFileSystemView.fileList.ls(path);
            for( var i = 0; i < pathls.length; i++ )
            {
                listDiv.append(
                    thisFileSystemView.makeDivForRecord( pathls[i], path ));
            }
        }
    };
}

FileSystemView.prototype.select = function(newdiv, path)
{
    if ( this.selectedDiv )
        this.selectedDiv.removeClass("sidebar-selected");

    this.selectedDiv = newdiv;
    this.selectedDiv.addClass("sidebar-selected");
}

FileSystemView.prototype.makeSelectFunction = function(newdiv, path)
{
    var thisFileSystemView = this;
    return function(evt)
    {
        thisFileSystemView.select(newdiv, path);
    };
}

FileSystemView.prototype.keyboardUpArrow = function()
{
    var selectables = $("div.sidebar-selectable");
    var index = selectables.index(this.selectedDiv);
    if( index > 0 )
    {
        index--;
        this.select( selectables.eq(index), "empty/some/path" );
    }
}

FileSystemView.prototype.keyboardDownArrow = function()
{
    var selectables = $("div.sidebar-selectable");
    var index = selectables.index(this.selectedDiv);
    if( index < selectables.length - 1 )
    {
        index++;
        this.select( selectables.eq(index), "empty/some/path" );
    }
}

FileSystemView.prototype.keyboardRightArrow = function()
{
    if( this.selectedDiv )
    {
        this.selectedDiv.data('expandFunction')();
    }
}

FileSystemView.prototype.keyboardLeftArrow = function()
{
    if( this.selectedDiv )
    {
        this.selectedDiv.data('expandFunction')();
    }
}


FileSystemView.prototype.getBlockName = function(block)
{
    return block.find( "> div.sidebar-label > span.sidebar-name-text" ).html();
}

FileSystemView.prototype.setBlockName = function(block, newname)
{
    return block.find( "> div.sidebar-label > span.sidebar-name-text" ).html(newname);
}

FileSystemView.prototype.getPathForBlock = function(block)
{
    if( block.parent().parent().hasClass("sidebar-block") )
    {
        return Path.join(
            this.getPathForBlock(block.parent().parent(),
            this.getBlockName(block) ) );
    }
    else
    {
        return this.getBlockName(block);
    }
}


FileSystemView.prototype.add = function( path, type )
{
    this.fileList.add(path, type);

    var parent_path = Path.parent(path);
    var parentBlock = this.getBlockDiv(Path.parent(path));
    if( parentBlock )
    {
        var listDiv = parentBlock.find( "> div.sidebar-list" );
        if( listDiv )
        {
            parentBlock.find( "> div.sidebar-list" ).append(
                this.makeDivForRecord(
                    {
                        name: Path.front(path),
                        type: type
                    },
                    parent_path
                )
            );
        }
    }

}

FileSystemView.prototype.remove = function( path )
{
    this.fileList.remove( path );
    this.getBlockDiv( path ).remove();
}

FileSystemView.prototype.udpateAllChildPaths = function( oldpath, newpath )
{
    var block = this.getBlockDiv( oldpath );

    block.add( block.find(".sidebar-block") )
        .map( function()
        {
            $(this).data( "path", newpath + $(this).data("path").slice( oldpath.length ) );
        }
    );
}

FileSystemView.prototype.rename = function( oldpath, newname )
{
    this.fileList.rename( oldpath, newname );

    var block = this.getBlockDiv( oldpath );
    block.find( "> div.sidebar-label > span.sidebar-name-text" ).html( newname );
    var newpath = Path.join( Path.parent(oldpath), newname );
    this.udpateAllChildPaths( oldpath, newpath );
}

FileSystemView.prototype.move = function( oldpath, newpath )
{
    this.fileList.move( oldpath, newpath );

    var block = this.getBlockDiv( oldpath ).detach();
    this.setBlockName( block, Path.front( newpath ) );

    var newparent = Path.parent( newpath );
    var newListDiv = this.getBlockDiv( newparent ).find( "> div.sidebar-list" );

    if( newListDiv.length != 0 )
    {
        if( block.length == 0 )
        {
            block = this.makeDivForRecord(this.fileList.getInfo( newpath ), newparent);
        }
        newListDiv.append( block );
    }

    this.udpateAllChildPaths( oldpath, newpath );
}

FileSystemView.prototype.refresh = function( path )
{
    this.fileList.move( oldpath, newpath );
}


FileSystemView.prototype.getInfo = function( path )
{
    return this.fileList.getInfo( path );
}

FileSystemView.prototype.getBlockDiv = function(path)
{
    return this.sidebarBody.find(".sidebar-block")
        .filter( function()
        {
            return $(this).data("path") == path;
        });
}

FileSystemView.prototype.getFilenameDiv = function(path)
{

}

