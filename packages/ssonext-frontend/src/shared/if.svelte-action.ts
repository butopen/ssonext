function getElementXPath(element) {
  if (element && element.id) return '//*[@id="' + element.id + '"]';
  else {
    var paths = []; // Use nodeName (instead of localName)
    // so namespace prefix is included (if any).
    for (
      ;
      element && element.nodeType == Node.ELEMENT_NODE;
      element = element.parentNode
    ) {
      var index = 0;
      var hasFollowingSiblings = false;
      for (
        var sibling = element.previousSibling;
        sibling;
        sibling = sibling.previousSibling
      ) {
        // Ignore document type declaration.
        if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;

        if (sibling.nodeName == element.nodeName) ++index;
      }

      for (
        var sibling = element.nextSibling;
        sibling && !hasFollowingSiblings;
        sibling = sibling.nextSibling
      ) {
        if (sibling.nodeName == element.nodeName) hasFollowingSiblings = true;
      }

      var tagName = (element.prefix ? element.prefix + ':' : '') + element.localName;
      var pathIndex = index || hasFollowingSiblings ? '[' + (index + 1) + ']' : '';
      paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? '/' + paths.join('/') : null;
  }
}

const nodes = {};

function hideNode(node, id) {
  const placeholder = document.createElement('b');
  placeholder.id = id;
  node.parentElement?.insertBefore(placeholder, node);
  node.parentElement?.removeChild(node);
}

function showNode(node, id) {
  const placeholder = document.getElementById(id);
  if (placeholder) {
    placeholder.parentElement?.insertBefore(node, placeholder);
    node.parentElement?.removeChild(placeholder);
  }
}

function manageNode(node, condition, id) {
  try {
    if (!condition) {
      hideNode(node, id);
    } else {
      showNode(node, id);
    }
  } catch {
    hideNode(node, id);
  }
}

export function _if(node: Node, condition: boolean) {
  const id = getElementXPath(node);
  nodes[id] = node;
  manageNode(node, condition, id);

  return {
    update(condition) {
      manageNode(nodes[id], condition, id);
    },
    destroy() {
      delete nodes[id];
    }
  };
}
