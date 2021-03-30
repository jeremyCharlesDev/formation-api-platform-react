import React from 'react'
import ContentLoader from 'react-content-loader'

const FormContentLoader = (props) => {
        const items = [];
        for (let n = 0; n < props.number; n++) {
            items.push(
                <ContentLoader viewBox="0 0 778 116" width={778} height={116} {...props} key={n}>
                <rect x="37" y="34" rx="0" ry="0" width="0" height="0" />
                <rect x="0" y="29" rx="0" ry="0" width="258" height="32" />
                <rect x="0" y="71" rx="0" ry="0" width="700" height="32" />
                <rect x="434" y="94" rx="0" ry="0" width="0" height="0" />
                <rect x="29" y="116" rx="0" ry="0" width="749" height="32" />
                </ContentLoader>
            )
            
        }
  return (
          <>
            {items}
          </>
  )
}


export default FormContentLoader