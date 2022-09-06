import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { findByParentId } from "@/api/cmn/dict";

import "./index.less";

const columns = [
	{ title: "名称", dataIndex: "name", key: "name" },
	{ title: "编码", dataIndex: "dictCode", key: "dictCode" },
	{ title: "值", dataIndex: "value", key: "value" },
	{
		title: "创建时间",
		dataIndex: "createTime",
		key: "createTime",
	},
];

function Dict() {
	const [dictList, setDictList] = useState<any[]>([]);

	useEffect(() => {
		const getDictList = async (id: number) => {
			const data = await findByParentId(id);
			setDictList(
				data.map((item: any) => {
					return {
						...item,
						isLeaf: true,
						children: [],
					};
				})
			);
		};

		getDictList(1);
	}, []);

	const handleExpand = (onExpand: any, record: any) => {
		return async (e: any) => {
			const data = await findByParentId(record.id);
			record.children = data.map((item: any) => {
				return {
					...item,
					isLeaf: false,
				};
			});
			onExpand(record, e);
		};
	};

	return (
		<Card>
			<Table
				columns={columns}
				dataSource={dictList}
				bordered
				rowKey="id"
				expandable={{
					// expandedRowRender: (record) => (
					// 	<p style={{ margin: 0 }}>{record.description}</p>
					// ),
					expandIcon: ({ expanded, onExpand, record }) => {
						if (!record.hasChildren) {
							return <span className="dict-box"></span>;
						}

						return expanded ? (
							<DownOutlined
								className="dict-icon"
								onClick={(e) => onExpand(record, e)}
							/>
						) : (
							<RightOutlined
								className="dict-icon"
								onClick={handleExpand(onExpand, record)}
							/>
						);
					},
				}}
				pagination={false}
			/>
		</Card>
	);
}

export default Dict;
