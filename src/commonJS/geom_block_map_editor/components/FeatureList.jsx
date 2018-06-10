import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const {
    PanelBody,
} = wp.components;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	if ( list instanceof Backbone.Collection ){
		const moved = list.models[startIndex];
		list.remove(moved);
		list.add(moved, { at: endIndex });
		return list;
	} else {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	}
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? '#eee' : '#eee',
    ...draggableStyle
});

const getListStyle = ( isDraggingOver ) => ({
    // background: isDraggingOver ? 'lightblue' : 'transparent',
    border: isDraggingOver ? 'solid 2px #333' : 'none',
});

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
	if ( source instanceof Backbone.Collection && destination instanceof Backbone.Collection ){
		const moved = source.models[droppableSource.index];
		source.remove(moved);
		destination.add(moved, { at: droppableDestination.index });
		const result = {};
		result[droppableSource.droppableId] = source;
		result[droppableDestination.droppableId] = destination;
		return result;
	} else {
		const sourceClone = Array.from(source);
		const destClone = Array.from(destination);
		const [removed] = sourceClone.splice(droppableSource.index, 1);
		destClone.splice(droppableDestination.index, 0, removed);
		const result = {};
		result[droppableSource.droppableId] = sourceClone;
		result[droppableDestination.droppableId] = destClone;
		return result;
	}
};

class InnerList extends React.Component {

	shouldComponentUpdate(nextProps: Props) {
		if( 'function' !== typeof this.props.items.map )
			return false;
		return true;
	}

	render() {
		if ( 'function' === typeof this.props.items.map ) {
			return this.props.items.map((item, index) => (
				<Draggable
					key={item.get('id')}
					draggableId={item.get('id')}
					index={index}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							style={getItemStyle(
								snapshot.isDragging,
								provided.draggableProps.style
							)}
						>
							{item.get('id')} { !_.isUndefined(item.get('title').rendered) ? item.get('title').rendered : item.get('title') }

						</div>
					)}
				</Draggable>
			))
		} else {
			return <div>something went wrong</div>;
		}
	}
}

const id2List = {
	droppable: 'featureCollection',
	droppable2: 'availableFeatureCollection',
};

class FeatureList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			availableFeatureCollection: props.availableFeatureCollection,
			featureCollection: props.featureCollection,
		};
	}

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    getList = id => this.state[id2List[id]];


    onDragEnd = result => {
        const { source, destination, draggableId } = result;

        // dropped outside the list
        if (!destination) return;


        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            let state = { items };
            if (source.droppableId === 'droppable') {
                state = { featureCollection: items };
            }
            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                availableFeatureCollection: result.droppable2,
                featureCollection: result.droppable
            });
        }

        // ??? we cant be sure if setState is finished
        // trigger changeFeatures
        // this.props.onChangeFeatures(_.pluck( this.state.featureCollection, 'id' ));
        this.props.onChangeFeatures( this.state.featureCollection );

    };

    render() {
    	const { availableFeatureCollection, featureCollection } = this.state;

        return ([
            <DragDropContext onDragEnd={this.onDragEnd}>

                <Droppable droppableId='droppable'>
                    {(provided, snapshot) => (
						<PanelBody
							title='Selected Features'
							className={'geom-panel geom-components-features-list-container-panel selected'}
						>
							<div
								className={'geom-features-list-container selected'}
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}
							>
								<InnerList items={featureCollection} />
								{provided.placeholder}

							</div>
                        </PanelBody>
                    )}
                </Droppable>

				<Droppable droppableId='droppable2'>
					{(provided, snapshot) => (
						<PanelBody
							title='Available Features'
							className={'geom-panel geom-components-features-list-container-panel available'}
						>
							<div
								className={'geom-features-list-container available'}
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}
							>
								<InnerList items={availableFeatureCollection} />
								{provided.placeholder}

							</div>
                        </PanelBody>
					)}
				</Droppable>

            </DragDropContext>,

            <div className={'geom-clearfix'}></div>

        ]);

    }
}

export default FeatureList;
