<?php

/*
    * https://github.com/sindresorhus/html-tags/blob/master/html-tags.json
*/

$htmlTags = 
[
	'a',
	'abbr',
	'address',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'bdi',
	'bdo',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'data',
	'datalist',
	'dd',
	'del',
	'details',
	'dfn',
	'dialog',
	'div',
	'dl',
	'dt',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	/*'head',*/
	'header',
	'hgroup',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'kbd',
	'label',
	'legend',
	'li',
	/*'link',*/
	'main',
	'map',
	'mark',
	'math',
	'menu',
	'menuitem',
	/*'meta',*/
	'meter',
	'nav',
	/*'noscript',*/
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'param',
	'picture',
	'pre',
	'progress',
	'q',
	'rb',
	'rp',
	'rt',
	'rtc',
	'ruby',
	's',
	'samp',
	/*'script',*/
	'section',
	'select',
	'slot',
	'small',
	'source',
	'span',
	'strong',
	/*'style',*/
	'sub',
	'summary',
	'sup',
	'svg',
	'table',
	'tbody',
	'td',
	'template',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	/*'title',*/
	'tr',
	'track',
	'u',
	'ul',
	'var',
	'video',
	'wbr'
];

$cssOutput = '';

$nodesYmNames = [];

$nodesYmValues = [];

$nodesYmNamesAndValues = [];

$nodesYmReset = [];

$styles = [];

/* Example, bar.com/lymnee/lymnee.php?cssNameFile=styles&excludeFiles=else.html,sub/foo.js&includeExtensions=html,js&path=/home/admin/web/foo.com/public_html/lymnee&prefixDataAttributes=data-some&uncompress=true */

/* Example, bar.com/lymnee/lymnee.php?cssNameFile=styles&excludeFiles=else.html,sub/foo.js&includeExtensions=html,js&path=/home/admin/web/foo.com/public_html/lymnee&prefixDataAttributes=data-some&reset=all&uncompress=true */ 

$_GET = preg_replace('/\s*,\s*/', ',', $_GET);
    
$cssNameFile = 'lymnee.css';

if (!empty($_GET['cssNameFile'])) {

    $cssNameFile = $_GET['cssNameFile'];

    $cssNameFile .= '.css';
     
}

$excludeDirectories = [];

if (!empty($_GET['excludeDirectories'])) {

    $excludeDirectories = explode(',', $_GET['excludeDirectories']);

}

$excludeFiles = [];

$excludeFiles[] = basename($_SERVER['PHP_SELF']);

if (!empty($_GET['excludeFiles'])) {

    $excludeFiles = explode(',', $_GET['excludeFiles']);

}

$includeExtensions = ['html'];

if (!empty($_GET['includeExtensions'])) {

    $includeExtensions = explode(',', $_GET['includeExtensions']);

}

$path = getcwd();

if (!empty($_GET['path'])) {

    if ($_GET['path'] !== 'current') {
    
        $path = $_GET['path'];
    
    }

}

$prefixDataAttributes = 'data-ym-';

if (!empty($_GET['prefixDataAttributes'])) {

    $prefixDataAttributes = $_GET['prefixDataAttributes'];

    $prefixDataAttributes .= '-';
     
}

$uncompress = TRUE;

if (!empty($_GET['uncompress'])) {

    $uncompress = filter_var($_GET['uncompress'], FILTER_VALIDATE_BOOLEAN);
     
}


/* 
    RecursiveDirectoryIterator throw warnings.

*/

function recursiveScan($directory) {
    
    global $listFiles;

    $tree = glob(rtrim($directory, '/') . '/*');
    
    if (is_array($tree)) {
    
        foreach ($tree as $file) {
        
            if (is_dir($file)) {
                
                recursiveScan($file);
                
            } elseif (is_file($file)) {

                $ignoreDirectory = FALSE; 

                $ignoreFile = FALSE;

                if ($GLOBALS['excludeDirectories']) {

                    foreach (preg_filter('/^/', $GLOBALS['path'].'/', $GLOBALS['excludeDirectories']) as $excludeDirectory) {

                        if (strpos(pathinfo($file, PATHINFO_DIRNAME), $excludeDirectory) !== FALSE) {

                            $ignoreDirectory = TRUE; 

                            break;

                        }

                    }

                }

                if (!$ignoreDirectory) {

                    $fileParts = pathinfo($file);

                    $fileInfo = $fileParts['dirname'].'/'.$fileParts['basename'];

                    foreach (preg_filter('/^/', $GLOBALS['path'].'/', $GLOBALS['excludeFiles']) as $excludeFile) {

                        if ($fileInfo === $excludeFile) {

                            $ignoreFile = TRUE; 

                            break;

                        }

                    }

                    if (!$ignoreFile) {

                        if (in_array(pathinfo($file, PATHINFO_EXTENSION), $GLOBALS['includeExtensions'])) {
                
                            $listFiles[] = $file;
                            
                        }
                        
                    }
                
                }

            }
            
        }
         
    }
     
    return $listFiles;
     
}

$globFiles = recursiveScan($path);

if ($globFiles) {

    foreach ($globFiles as $globFile) {

        $doc = new DOMDocument();

        libxml_use_internal_errors(true);

        $doc->loadHTMLFile($globFile);

        libxml_clear_errors();

        $xpath = new DOMXpath($doc);

        if (!empty($_GET['reset'])) {

            if ($_GET['reset'] === 'lymnee') {

                $tags = $xpath->query('//*[starts-with(name(@*), "'.substr($prefixDataAttributes, 0, -1).'")]');

                foreach ($tags as $tag) {

                    if (!in_array($tag->nodeName, $nodesYmReset)) {

                        $nodesYmReset[] = $tag->nodeName;

                    }

                }

            }

            if ($_GET['reset'] === 'all') {

                $tags = $xpath->query('//*');

                foreach ($tags as $tag) {

                    if (in_array($tag->nodeName, $htmlTags)) {

                        if (!in_array($tag->nodeName, $nodesYmReset)) {

                            $nodesYmReset[] = $tag->nodeName;
    
                        }

                    }

                }

            }

        }

        $elements = $xpath->query('//@*[starts-with(name(), "'.substr($prefixDataAttributes, 0, -1).'")]');

        foreach ($elements as $element) {
        
            $nodesYmNames[] = $element->nodeName;
        
            $nodesYmValues[] = $element->nodeValue;
        
        }

    }

}

$nodesYmNamesAndValues = array_map(
    
    NULL, 
    
    $nodesYmNames, 
    
    $nodesYmValues

);

/*
    "array_unique() is not intended to work on multi dimensional arrays."

    We'll sort array later.
*/

$nodesYmNamesAndValues = array_map(
    
    'unserialize', 

    array_unique(

        array_map(

            'serialize', 

            $nodesYmNamesAndValues

            )
    
    )

);

foreach ($nodesYmNamesAndValues as $nodeYmNameAndValue) {

    $rules = explode(' || ', $nodeYmNameAndValue[1]);

    foreach ($rules as $rule) {

        $style = [];

        $style['contextualSelector'] = NULL;
    
        $style['media'] = NULL;

        $style['pseudoElement'] = NULL;
    
        $style['support'] = NULL;    

        $ruleSupport = explode(' !! ', $rule);
    
        if (!empty($ruleSupport[1])) {
        
            $style['support'] = trim($ruleSupport[1]);
            
        }

        $ruleContextualSelector = explode(' && ', $ruleSupport[0]);
    
        if (!empty($ruleContextualSelector[1])) {
        
            $style['contextualSelector'] = trim($ruleContextualSelector[1]);
            
        }

        $ruleMedia = explode('@', $ruleContextualSelector[0]);

        if (!empty($ruleMedia[1])) {
        
            $style['media'] = trim($ruleMedia[1]);
            
        }

        $rulePseudoElement = explode('@', $ruleMedia[0]);

        if (!empty($rulePseudoElement[1])) {
        
            $style['pseudoElement'] = trim($rulePseudoElement[1]);
            
        }

        $style['value'] = trim($rulePseudoElement[0]);

        $style['selector'] = trim($nodeYmNameAndValue[0]) . '=' . '"' . trim($nodeYmNameAndValue[1]) . '"';

        $style['property'] = trim($nodeYmNameAndValue[0]);

        $styles[] = $style;

    }
    
}

/*
    We sort.
*/

if (!empty($nodesYmReset)) {

    sort($nodesYmReset);

}

array_multisort(

    array_map(function($element) {

            return $element['selector'];
    }, 

    $styles), 

    SORT_ASC,

$styles);

if (!empty($nodesYmReset)) {

    foreach ($nodesYmReset as $nodeYmReset) {

        $cssOutput .= $nodeYmReset;

        if (next($nodesYmReset)) {

            $cssOutput .= ',';

            if ($uncompress) {

                $cssOutput .= "\n";

            }

        } else {

            if ($uncompress) {

                $cssOutput .= ' ';

            } 

        }

    }

    $cssOutput .= '{';

    if ($uncompress) {

        $cssOutput .= "\n";

        $cssOutput .= "\t";

        $cssOutput .= 'all: unset';

        $cssOutput .= "\n";

    } else {

        $cssOutput .= 'all:unset';
    }
    
    $cssOutput .= '}';
    
    if ($uncompress) {

        $cssOutput .= "\n";

    }

}

if ($uncompress) {

    $tabs = 0;

}

foreach ($styles as $style) {

    if ($style['support'] !== NULL) {

        $cssOutput .= '@';

        $cssOutput .= 'supports';

        if ($uncompress) {

            $cssOutput .= ' ';

        }

        $cssOutput .= '(';

        $cssOutput .= $style['support'];

        $cssOutput .= ')';

        if ($uncompress) {

            $cssOutput .= ' ';
    
        }

        $cssOutput .= '{';

        if ($uncompress) {

            $cssOutput .= "\n";

            $cssOutput .= str_repeat("\t", ++$tabs);

        }

    }

    if ($style['media'] !== NULL) {

        $cssOutput .= '@';

        $cssOutput .= $style['media'];

        if ($uncompress) {

            $cssOutput .= ' ';
    
        }

        $cssOutput .= '{';

        if ($uncompress) {

            $cssOutput .= "\n";

            $cssOutput .= str_repeat("\t", ++$tabs);
    
        }

    }

    if ($style['contextualSelector'] !== NULL) {

        $cssOutput .= '.';

        $cssOutput .= $style['contextualSelector'];

        $cssOutput .= ' ';

        $cssOutput .= '[';

        $cssOutput .= $style['selector'];

        $cssOutput .= ']';

    } else {

        $cssOutput .= '[';

        $cssOutput .= $style['selector'];

        $cssOutput .= ']';

    }

    if ($style['pseudoElement'] !== NULL) {

        $cssOutput .= '::';

        $cssOutput .= $style['pseudoElement'];

    }

    if ($uncompress) {

        $cssOutput .= ' ';

    }

    $cssOutput .= '{';

    if ($uncompress) {

        $cssOutput .= "\n";

        $cssOutput .= str_repeat("\t", ++$tabs);

    }

    $cssOutput .= str_replace($prefixDataAttributes, '', $style['property']);

    $cssOutput .= ':';

    if ($uncompress) {

        $cssOutput .= ' ';

    }

    $cssOutput .= $style['value'];

    if ($uncompress) {

        $cssOutput .= "\n";

        $cssOutput .= str_repeat("\t", --$tabs);

    }

    $cssOutput .= '}';

    if ($uncompress) {

        $cssOutput .= "\n";

    }

    if ($style['media'] !== NULL) {

        if ($uncompress) {

            $cssOutput .= str_repeat("\t", --$tabs);

        }

        $cssOutput .= '}';

        if ($uncompress) {
    
            $cssOutput .= "\n";
    
        }

    }

    if ($style['support'] !== NULL) {

        $cssOutput .= '}';

        if ($uncompress) {
    
            $cssOutput .= "\n";
    
        }

    }

}

if (file_put_contents($cssNameFile, $cssOutput)) {

    $result = '<p style="all:unset;display:block;margin-top:1rem;">The file <span style="color:red;">[</span>'.$cssNameFile.'<span style="color:red;">]</span> was saved!</p>';

} else {

    $result = '<p style="all:unset;display:block;margin-top:1rem;"><span style="text-decoration:line-through;">An error occured</span>.</p>';

}

echo <<<EOT
<!doctype html>
<html style="all:unset;display:block;">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAw0lEQVR42u3cUQ3CQBBF0VeCDIzUCCKLEIzgA1zMtrxzDEwmuV+TzSYAAAAAAAAAAAAAAAAAAAAAAAAAAMB629Sgb/JIsq9e+CLeW/KZGHQfXGpPcgzOu7JnktfEoNvqTVlLAOUEUE4A5QRQTgDlBFBOAOUEUM4p+JzGTsEAAAAAAAAAAADAf/Ao9Jz8D1DO/wDMEEA5AZQTQDkBlBNAOQGUE0A5AZRzCj4n/wMAAAAAAAAAAAAAAAAAAAAAAAAAAECVH8wQD/l56TphAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA4LTE0VDIyOjE5OjUzKzAwOjAwkwttpgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOC0xNFQyMjoxOTo1MyswMDowMOJW1RoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC">
    <title>Lymnee</title>
</head>
<body style="all:unset;color:#222;display:block;font-family:monospace;font-size:x-large;margin:1rem auto;padding:1rem;">
<h1 style="all:unset;display:block;font-size:2rem;"><span style="color:red;">=</span> Lymnee</h1>
$result
<p style="all:unset;color:red;display:block;margin-top:1rem;">=====</p>
<pre style="all:unset;display:block;margin-top:1rem;white-space:pre-wrap;white-space:break-spaces;">$cssOutput</pre>
</body>
</html>
EOT;
