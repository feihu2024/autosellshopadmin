<template>
  <div>
    <TreeFlowChart v-if="treeData.nodes.length > 0" :tree-data="treeData" />
  </div>
</template>

<script>
import TreeFlowChart from './components/TreeFlowChart.vue';
import axios from "@/utils/axios";
export default {
  components: {
    TreeFlowChart
  },
  data() {
    return {
      treeData: {
        nodes: [],
        edges: []
      }
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        user_id: Number(this.$route.query.id)
      }
      axios
        .get("/autoselladmin/manage/member/get_ordertree", { params: params })
        .then((res) => {
          // res.data[0].next = res.next
          // console.log(res);

          let obj = res.data[0]
          obj.next = res.next
          // console.log(obj)


          let arr = this.convertToTree(obj)
          // console.log(this.treeData);


          this.treeData = this.transformTreeToGraph([arr]);

          console.log(this.treeData);

        });
    },
    convertToTree(data) {
      // 收集所有节点到一个数组
      const allNodes = [];

      function collectNodes(node) {
        if (!node) return;

        if (node.u_id) {
          allNodes.push({
            id: node.u_id,
            o_id: node.o_id,
            p_id: node.p_id,
            name: node.o_name,
            phone: node.phone,
            children: []
          });
        }

        if (node.data) {
          node.data.forEach(item => collectNodes(item));
        }

        if (node.next) {
          collectNodes(node.next);
        }
      }

      collectNodes(data);

      // 创建 o_id 到节点的映射
      const oIdMap = new Map();
      allNodes.forEach(node => {
        oIdMap.set(node.o_id, node);
      });

      // 构建树结构
      const root = allNodes[0]; // 第一个节点是根节点

      // 为每个节点分配子节点
      allNodes.forEach(node => {
        const parent = oIdMap.get(node.p_id);
        if (parent && parent !== node) {
          parent.children.push(node);
        }
      });

      return root;
    },
    /**
 * 将嵌套树结构转换为节点和边的扁平结构
 * @param {Array} treeData - 嵌套的树状结构数据
 * @returns {Object} - 包含nodes和edges数组的对象
 */
    transformTreeToGraph(treeData) {
      const nodes = [];
      const edges = [];

      // 处理每个根节点
      treeData.forEach(root => {
        // 添加根节点
        this.addNode(root, nodes);

        // 递归处理子节点
        if (root.children && root.children.length > 0) {
          this.processChildren(root, root.children, nodes, edges);
        }
      });

      return { nodes, edges };
    },

    /**
     * 添加节点到节点数组
     * @param {Object} item - 当前处理的项目
     * @param {Array} nodes - 节点数组
     */
    addNode(item, nodes) {
      nodes.push({
        id: String(item.id),
        data: {
          email: "",
          fax: "",
          name: item.name,
          phone: item.phone,
          position: "",
          status: "online"
        }
      });
    },

    /**
     * 递归处理子节点
     * @param {Object} parent - 父节点
     * @param {Array} children - 子节点数组
     * @param {Array} nodes - 节点数组
     * @param {Array} edges - 边数组
     */
    processChildren(parent, children, nodes, edges) {
      children.forEach(child => {
        // 添加子节点
        this.addNode(child, nodes);

        // 添加边 (从父节点到子节点)
        edges.push({
          source: String(parent.id),
          target: String(child.id)
        });

        // 递归处理子节点的子节点
        if (child.children && child.children.length > 0) {
          this.processChildren(child, child.children, nodes, edges);
        }
      });
    }

  }
}
</script>