
jsonSidebarObject = {
    root: {
        name: "root",
        children: [
            {
                type: "drive",
                name: "Game",
                children: [
                    {
                        type: "directory",
                        name: "jeff",
                        children: [
                            { name: "A.xtx", children: [] },
                            { name: "B.xtx", children: [] },
                        ]
                    },
                    { name: "myFile1", children: [] },
                    { name: "myFile2", children: [] },
                    { name: "myFile11", children: [] },
                    { name: "myFile12", children: [] },
                    {
                        type: "directory",
                        name: "my empty directory",
                        children: [] ,
                    } ,
                    { name: "more file.txt", children: [] },
                ] ,
            } ,
            {
                type: "drive",
                name: "MyDrive2",
                children: [
                    { name: "myOtherFile1", children: [] },
                    { name: "myOtherFile2", children: [] },
                    { name: "myOtherFile11", children: [] },
                    { name: "myOtherFile12", children: [] },
                ] ,
            } ,
        ] ,
    } ,

    findChild: function( cursor, name )
    {
        var child = {children: []};

        for( var i = 0; i < cursor.children.length; i++ )
        {
            if( cursor.children[i].name == name )
            {
                return cursor.children[i];
            }
        }
    } ,

    removeChild: function( cursor, name )
    {
        var i = 0;
        for( ; i < cursor.children.length; i++ )
        {
            if( cursor.children[i].name == name )
            {
                var child = cursor.children[i];
                cursor.children.splice(i, 1);
                return child;

            }
        }

        return {name:"ERROR", children: []};
    } ,

    getInfo: function( path )
    {
        cursor = this.root;

        while( path != '' )
        {
            cursor = this.findChild( cursor, path.split('/')[0] );
            path = path.split('/').slice(1).join('/');
        }

        return cursor;
    } ,

    ls: function( path )
    {
        return this.getInfo(path).children;
    } ,

    add: function( path, type )
    {
        var parent = path.split('/').slice(0,-1).join('/');
        var name = path.split('/').slice(-1)[0];

        this.getInfo( parent ).children.push(
            {
                name: name,
                type: type,
                children: [],
            });
    } ,

    remove: function( path )
    {
        var parent = path.split('/').slice(0,-1).join('/');
        var name = path.split('/').slice(-1)[0];
        var parent_node = this.getInfo(parent);

        this.removeChild( parent_node, name );
    } ,

    move: function(source_path, target_path)
    {
        var target_parent = target_path.split('/').slice(0,-1).join('/');
        var target_name = target_path.split('/').slice(-1)[0];

        var source_parent = source_path.split('/').slice(0,-1).join('/');
        var source_name = source_path.split('/').slice(-1)[0];

        var node = this.removeChild( this.getInfo( source_parent ), source_name );
        node.name = target_name;

        this.getInfo( target_parent ).children.push(node);
    } ,

    rename: function( oldpath, newname )
    {
        this.getInfo(oldpath).name = newname;
    } ,
};



























